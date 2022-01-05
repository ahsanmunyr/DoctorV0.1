import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image, ScrollView} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize,
    responsiveHeight
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux";
import CameraIcon from "react-native-vector-icons/AntDesign"
import Btn from '../../components/btn';
import InputField from '../../components/InputField';
import MailIcon from "react-native-vector-icons/Fontisto";
import UserIcon from "react-native-vector-icons/AntDesign";
import LocationIcon from "react-native-vector-icons/Entypo";
import ImageModel from "../../components/imagePikerModel";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorModel from '../../components/errorModel';
import SuccesModel from "../../components/succesModel";
import {api} from "../../config/config.json"
import { middleware } from 'yargs';
function Profile ({navigation,logOut,editProfile,getProfile,user,profile,removeOnlineStatus}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)
    const [submit,setSubmit]=useState(false)
    const [imgModel,setImgModel]=useState(false)
    const [loader,setLoader]=useState(false)
    const [model,setModel]=useState(false)
    const [delModel,setDelModel]=useState(false)
    const [data,setData]=useState(false)
    const [fields,setFields]=useState({
        email:"",
        first_name:"",
        last_name:"",
        mobile_no:"",
        address:""
    })
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:"white",fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>
          });
    },[navigation])
    function getValue(k,v){
        setFields((pS)=>{
            return{
                ...pS,
                [k]:v
            }
        })
    }
    useEffect(()=>{
        getProfile(user.user_id).then(()=>{
            setLoading(false)
        })
    },[])

    const getProfileMemo=useMemo(()=>{
        if(profile.id){
            setFields(profile)
        }
    },[profile])

    function onLogOut(){
        logOut().then(()=>removeOnlineStatus(user.user_id))
    }
    function openGallery(){
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
          }).then(image => {
            getValue("user_image",image)
            setImgModel(false)
          });
    }

    function openCamera(){
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true
          }).then(image => {
            getValue("user_image",image)
            setImgModel(false)
          });
    }

    function onEditProfile(){
        setSubmit(true)
        if(fields.first_name && fields.last_name && fields.address && fields.mobile_no){
            setLoader(true)
            setSubmit(false)
            editProfile({...fields,user_image:fields.user_image?fields.user_image:""}).then((res)=>{
                setData(res)
                setLoader(false)
                res.status?setModel(true):setDelModel(true)
                getValue("imageEdit",false)
            }).catch((err)=>{
                console.log(err)
                setLoader(false)
            })
        }
    }

    function renderModel(){
        if(data.status){
            return(
                <SuccesModel
                closeModle={()=>setModel(false)}
                title={data.msg}
                visible={model}
                />

            )
        }
        return (
            <ErrorModel
            visible={delModel}
            title={data.msg}
            closeModle={()=>setDelModel(false)}
            />
        )
    }
    if(loading){
        return <Loader/>
    }else{
        return(
            <ScrollView style={{flex:1,width:'100%'}}>
                <ImageModel
                visible={imgModel}
                closeModle={()=>setImgModel(false)}
                goToCamera={openCamera}
                goToGallery={openGallery}
                />
                {data?renderModel():null}
                <View
                style={styles.box}
                />
                <View style={{...styles.profile,position: 'absolute', top: responsiveHeight(12), left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{
                    width:responsiveFontSize(15),
                    }}>
                    <Image
                    style={{
                        width:responsiveFontSize(15),
                        height:responsiveFontSize(15),
                        borderRadius:responsiveFontSize(7.5)
                    }}
                    source={fields.user_image?{uri:(fields.user_image.path?fields.user_image.path:api+"/"+fields.user_image)}:require('../../../assets/profile.png')}
                    />
                    <TouchableOpacity 
                    onPress={()=>setImgModel(true)}
                    style={{
                        backgroundColor:'grey',
                        height:responsiveFontSize(3),
                        width:responsiveFontSize(3),
                        borderRadius:responsiveFontSize(1.5),
                        justifyContent:'center',
                        alignItems:'center',
                        position:'absolute',
                        bottom:5,
                        right:5
                        }}>
                        <CameraIcon
                        name="camera"
                        color="white"
                        size={responsiveFontSize(1.5)}/>
                    </TouchableOpacity>
                </View>
                </View>

                <View style={{width:'90%',marginLeft:'auto',marginRight:'auto',marginTop:responsiveHeight(12)}}>
                    
                <InputField
                error={!fields.first_name&& submit?true:null}
                defaultValue={fields.first_name}
                getValue={(v)=>getValue('first_name',v)}
                icon={()=>{
                    return(
                        <UserIcon 
                        name="user"
                        color={colors.card}
                        size={20}
                        />
                    )
                }}
                password={false}
                placeHolder="First Name"
                color="grey"
                />
                <InputField
                error={!fields.last_name&& submit?true:null}
                defaultValue={fields.last_name}
                getValue={(v)=>getValue('last_name',v)}
                icon={()=>{
                    return(
                        <UserIcon 
                        name="user"
                        color={colors.card}
                        size={20}
                        />
                    )
                }}
                password={false}
                placeHolder="Last Name"
                color="grey"
                />
                <InputField
                defaultValue={fields.email}
                error={!fields.email&& submit?true:null}
                getValue={(v)=>getValue('email',v)}
                icon={()=>{
                    return(
                        <MailIcon 
                        name="email"
                        color={colors.card}
                        size={20}
                        />
                    )
                }}
                disable={true}
                password={false}
                placeHolder="Email"
                color="grey"
                />
                <InputField
                defaultValue={fields.mobile_no}
                error={!fields.mobile_no&& submit?true:null}
                getValue={(v)=>getValue('mobile_no',v)}
                icon={()=>{
                    return(
                        <MailIcon 
                        name="mobile-alt"
                        color={colors.card}
                        size={20}
                        />
                    )
                }}
                password={false}
                keyboardType="number"
                placeHolder="Mobile No"
                color="grey"
                />
            <InputField
                colunms={4}
                defaultValue={fields.address}
                error={!fields.address&& submit?true:null}
                getValue={(v)=>getValue('address',v)}
                icon={()=>{
                    return(
                        <LocationIcon 
                        name="location"
                        color={colors.card}
                        size={20}
                        />
                    )
                }}
                password={false}
                keyboardType="number"
                placeHolder="Address"
                color="grey"
                />
                    <View style={{marginVertical:responsiveHeight(2)}}>
                        <Btn
                        text="Update"
                        color={colors.card}
                        loader={loader}
                        call={onEditProfile}
                        />
                    </View>
                    <View style={{marginBottom:responsiveHeight(5)}}>
                        <Btn
                        text="logout"
                        color="grey"
                        call={onLogOut}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
  box:{
      height:responsiveHeight(20),
      backgroundColor:'#97d1f0',
      borderBottomLeftRadius:responsiveFontSize(10),
      borderBottomRightRadius:responsiveFontSize(10),
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
      elevation: 5,
  },
  profile:{
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    
    elevation: 11,
  }
})

function mapStateToProps({user,profile}){
    return {
        user,
        profile
    }
}

export default connect(mapStateToProps,actions)(Profile);
