import React, { useState, useCallback, useEffect, useMemo,useLayoutEffect } from 'react'
import { View,Text, ActivityIndicatorComponent, TextInput,ActivityIndicator,Image,Platform ,PermissionsAndroid,Linking} from 'react-native';
import { GiftedChat,Bubble,Actions,ActionsProps} from 'react-native-gifted-chat';
import RNFetchBlob from "rn-fetch-blob"
import AddIcon from "react-native-vector-icons/Entypo";
import {
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from "react-redux"
import * as actions from "../../store/action"
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
// import getPath from '@flyerhq/react-native-android-uri-path';
import FileIcon from "react-native-vector-icons/Ionicons"
import storage from '@react-native-firebase/storage';
import DownloadIcon from "react-native-vector-icons/Entypo"
import Icon from 'react-native-vector-icons/Entypo';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useNavigation, useTheme} from "@react-navigation/native"
import axios from 'axios';

const managerUrl='https://api.outsourceinpakistan.com/uploads/user/'
const clientUrl='https://api.outsourceinpakistan.com/uploads/client/'


function Chat({route,sendMessage,firebaseMessages,getMessages,readMessages,clearChat,getMobileToken,getToken}) {
  const {colors}=useTheme();
  const {sId,rId,sName,sImage,rec,role}=route.params
  const navigation=useNavigation()
  const [messages, setMessages] = useState([]);
  const [size,setSize]=useState(0)
  const [lastDate,setLastDate]=useState("")
  const [progess,setProgess]=useState({total:0,transtered:0})
  const [imgUrl,setImgUrl]=useState("")
  const [fileUrl,setFileUrl]=useState("")
  const [extension,setExtension]=useState("")


  useLayoutEffect(()=>{
    navigation.setOptions({
        headerTitle: props => <Text style={{textAlign:'left',color:"white",fontSize:responsiveFontSize(2),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{rec.name}</Text>,        
      });
},[navigation])

  useEffect(()=>{
    getSize()
    getMessages(sId,rId,lastDate ,()=>readMessages(sId,rId,sName,rec.name)).then(res=>{
      return navigation.addListener('blur',async()=>{
        await res()
        console.log("blur")
        clearChat()
        setSize(0)
      })
    })
  },[navigation,lastDate])

  function getSize(){
    function mergeId(id1,id2){
      if(id1<id2){
          return id1+id2
      }else{
          return id2+id1
      }
  }
    firestore().collection('chat').doc("conversation").collection(mergeId(sId,rId)).onSnapshot(data=>{
      setSize(data.size)
    })
  }

  useMemo(() => {
    function mergeId(id1,id2){
      if(id1<id2){
          return id1+id2
      }else{
          return id2+id1
      }
      }
        setMessages(firebaseMessages.map((data)=>({...data,createdAt:data.timeStamp.toDate()})).sort((a,b)=>b.createdAt-a.createdAt))
  }, [firebaseMessages])

  const onSend = useCallback((messages = [],imgUrl,fileUrl,extension) => {
    if(imgUrl || messages[0].text || fileUrl){
      if(imgUrl){
        messages[0].image=imgUrl
        messages[0].text=messages[0].text?messages[0].text:"Image"
        setImgUrl("")
      }
      if(fileUrl){
        messages[0].file=fileUrl
        messages[0].extension=extension
        messages[0].text=messages[0].text?messages[0].text:"File"
        messages[0].system=true
        setFileUrl("");
        setExtension("");
      }
      sendMessage(messages,messages[0].user._id,{id:rId,name:rec.name,url:rec.image,mobileToken:rec.mobile_token?rec.mobile_token:"no token"},messages[0].user.name,messages[0].user.avatar).then(async()=>{
        if(role){
          const uRole=(role=="Dr"?'PR':"DR")
        // get token
          getToken(rId,uRole).then(res=>{
          //send notification
          getMobileToken(sName,messages[0].text,res.mobileToken)
          })

        }else{
          //send notification
          getMobileToken(sName,messages[0].text,rec.mobile_token)
        }
        
      })// send user id and rec id
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }
  }, [])

  function handlePickImage(){
    setImgUrl("")
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then((images) => {
      const name=images.path.slice(images.path.lastIndexOf('/'),images.path.length)
      const reference = storage().ref(`chatImages/${name}`);
      const pathToFile = `${images.path}`;
      const task=reference.putFile(pathToFile)
      task.on('state_changed', taskSnapshot => {
        setProgess({total:taskSnapshot.totalBytes,transtered:taskSnapshot.bytesTransferred})
      })
      task.then(async(res)=>{
       const url =await reference.getDownloadURL()
       setProgess({total:0,transtered:0})
       setImgUrl(url)
       setFileUrl("")
      })
    });
  }
  async function handlePickFile(){
    setFileUrl("")
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // const ext=res.uri.slice(res.uri.lastIndexOf('.'),res.uri.length)
      const ext=res.name.slice(0,3)+"..."
      setExtension(ext)
      var path=res.uri
        if(Platform.OS=="android"){
        //   path=getPath(res.uri)
        }
      const reference = storage().ref(`chatFiles/${res.name}`);
      const pathToFile = `${path}`;
      const task= reference.putFile(pathToFile)
      task.on('state_changed', taskSnapshot => {
        setProgess({total:taskSnapshot.totalBytes,transtered:taskSnapshot.bytesTransferred})
      })
      task.then(async()=>{
       const url =await reference.getDownloadURL()
       setProgess({total:0,transtered:0})
       setFileUrl(url)
       setImgUrl("")
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async function downloadFile(fileMessage){
    if (Platform.OS === 'android') {
      const status=await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      if(status=="granted"){
        const date=new Date()
        const { config, fs } = RNFetchBlob
        let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
          fileCache: true,
          addAndroidDownloads : {
            useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification : true,
            path:  PictureDir + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
            description : 'Downloading image.'
          }
        }
        config(options).fetch('GET', fileMessage.file)
      }
    }else{
      Linking.openURL(fileMessage.file)
    }
  }

  function renderActions(props){
    return(
      <Actions
      {...props}
      options={{
        ['Upload Image']:handlePickImage,
        ['Upload File']: handlePickFile,
      }}
      icon={() => (
        <AddIcon name='plus' size={28} color="#05798a" />
      )}
      onSend={args => console.log("send wsafsdf")}
    />
    )
    
  }
  return (
    <>
        <View style={{display:(progess.transtered*100)/progess.total || (progess.transtered*100)/progess.total==0 ?null:'none',backgroundColor:'white',width:'100%'}}>
        <Progress.Bar 
        useNativeDriver={true}
        progress={(progess.transtered*100)/progess.total || (progess.transtered*100)/progess.total==0 ?((progess.transtered*100)/progess.total)/100:0}
        animated={true} 
        width={0}
        borderRadius={0}
        color={'green'}
        style={{width:'100%',backgroundColor:'white'}} />
        <Text style={{fontSize:12,margin:5,color:'grey',width:'100%',textAlign:'center'}}>Uploading...</Text>
        </View>
        {/* <View
        style={{height:3,width:(progess.transtered*100)/progess.total+"%",backgroundColor:'green',display:(progess.transtered*100)/progess.total?null:'none'}}
        /> */}
        <GiftedChat
        messagesContainerStyle={{backgroundColor:'white'}}
        loadEarlier={size>messages.length?true:false}
        onLoadEarlier={()=>{
          setLastDate([...messages].reverse()[0].createdAt)
        }}
        renderActions={renderActions}
        renderBubble={(props)=><Bubble
          {...props}
          wrapperStyle={{
            right:{
              backgroundColor:colors.card
            }
          }}
        />}
        renderAccessory={imgUrl || fileUrl?(()=>{
            if(imgUrl){
              return(
                <Image style={{width:50,height:50}} source={{uri:imgUrl}}/>
              )
            }
            else if(fileUrl){
              return(
                <View style={{marginLeft:20}}>
                  <FileIcon
                  color="grey"
                  name="document-attach"
                  size={30}
                  />
                </View>
              )
            }
        }):null}
        renderSystemMessage={(props)=>{
          const {position}=props;
          if(position=="left"){
            return(
              <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:3,marginLeft:8}}>
                <View>
                  <Image
                  style={{width:35,height:35,borderRadius:35/2}}
                  source={{uri:props.currentMessage.user.avatar}} 
                  />
                </View>
                <View style={{width:'100%',alignItems:'flex-start',marginLeft:8}}>
                <View style={{backgroundColor:'#f0f0f0',width:'50%',borderRadius:12,justifyContent:'center'}}>
                  <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingTop:5,}}>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                  <FileIcon
                      color="grey"
                      name="document-attach"
                      size={40}
                      />
                  <Text style={{color:'gray',fontSize:18}}>{props.currentMessage.extension}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>downloadFile(props.currentMessage)}>
                    <DownloadIcon
                    name="arrow-down"
                    color="black"
                    size={40}
                    />
                  </TouchableOpacity>
                  </View>
                  <Text style={{paddingVertical:5,color:'gray',marginLeft:10,fontSize:15}}>{props.currentMessage.text}</Text>
                  <Text style={{paddingBottom:5,color:'gray',marginRight:10,fontSize:10,textAlign:'right'}}>{props.currentMessage.createdAt.getHours()+":"+props.currentMessage.createdAt.getMinutes()}</Text>
                </View>
              </View>
              </View>
            )
          }else{
            return(
              <View style={{flexDirection:'row',alignItems:'flex-end',width:'100%',justifyContent:'flex-end',marginBottom:3}}>
                <View style={{width:'50%',alignItems:'flex-end',marginRight:8}}>
                <View style={{backgroundColor:'#05798a',width:'100%',borderRadius:12,justifyContent:'center'}}>
                  <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingTop:5,}}>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                  <FileIcon
                      color="white"
                      name="document-attach"
                      size={40}
                      />
                  <Text style={{color:'white',fontSize:18}}>{props.currentMessage.extension}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>downloadFile(props.currentMessage)}>
                    <DownloadIcon
                    name="arrow-down"
                    color="lightgrey"
                    size={40}
                    />
                  </TouchableOpacity>
                  </View>
                  <Text style={{paddingVertical:5,color:'white',marginLeft:10,fontSize:15}}>{props.currentMessage.text}</Text>
                  <Text style={{paddingBottom:5,color:'white',marginRight:10,fontSize:10,textAlign:'right'}}>5:00 PM</Text>
                </View>
              </View>
              <View style={{marginRight:8}}>
                  <Image
                  style={{width:35,height:35,borderRadius:35/2}}
                  source={{uri:props.currentMessage.user.avatar}} 
                  />
                </View>
              </View>
            )
          }
        }}
        messages={messages}
        alwaysShowSend={true}
        onSend={messages => onSend(messages,imgUrl,fileUrl,extension)}
        renderUsernameOnMessage={true}
        showUserAvatar={true}
        user={{
          _id:sId,
          name:sName,
          avatar:sImage,
        }}
        renderLoading={()=>(
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size={30} color="#05798a"/>
          </View>
        )}
      />
    </>
  )
}

function mapStateToProps({firebaseMessages}){
    return {firebaseMessages}
}

export default connect(mapStateToProps,actions)(Chat);