import React, {useRef, useState,useEffect } from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid, Dimensions,AppState,NativeModules} from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
// Import the UI styles.
import styles from './styles'
import { NavigationContainer, DefaultTheme,DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect} from 'react-redux';
import Login from "./screens/auth/login";
import signUp from './screens/auth/signUp';
import forgetPassword from './screens/auth/forgetPassword';
import * as actions from "./store/action";
import Loader from './components/pageLoader';
import Doctor from './screens/doctor/doctor';
import Search from './screens/search/search';
import AppointMents from './screens/appointments/appointMents';
import Home from './screens/home/home';
import Notification from './screens/notification/notification';
import HomeIcon from "react-native-vector-icons/FontAwesome5";
import DoctorIcon from "react-native-vector-icons/Fontisto";
import SearchIcon from "react-native-vector-icons/Fontisto";
import NotiIcon from "react-native-vector-icons/AntDesign";
import AppointmentIcon from "react-native-vector-icons/MaterialIcons"
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import DoctorDetail from './screens/doctor/doctorDetail';
import SearchRecords from './screens/search/searchRecords';
import Profile from './screens/profile/profile';
import AsyncStorage from "@react-native-community/async-storage"
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import BookAppointment from './screens/appointments/bookAppointment';
import DoctorHome from "./screens/doctorScreen/home"
import DoctorAppoint from './screens/doctorScreen/doctorAppoint';
import DoctorProfile from "./screens/doctorScreen/profile"
import Chat from "./screens/chat/chat"
import chatBoard from './screens/chat/chatBoard';
import axios from 'axios';
import IncommingCall from './screens/videoCall/incommingCall';
import firestore from '@react-native-firebase/firestore';
import RNCallKeep from 'react-native-callkeep';

const Tab = createBottomTabNavigator();
const Stack=createStackNavigator();


const {width}=Dimensions.get('window')

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    card:'#0097e1',
    background:'#fbfaff',
    text:'#0d3b80'
  }
};
const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    card:'#a2a725',
    background:'#404040',
    text:'#ffffff'
  }
};

function AuthRoutes(){
  return(
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen 
      options={{headerShown:false}}
      name="login" 
      component={Login}
      />
      <Stack.Screen 
      options={{headerShown:false}}
      name="signUp" 
      component={signUp}
      />
      <Stack.Screen 
      options={{headerShown:false}}
      name="forgetPassword" 
      component={forgetPassword}
      />
    </Stack.Navigator>
  )
}

function HomeRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor:"#fff",
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="home"
      options={{title:"Home"}}
      component={Home}
      />
      <Stack.Screen
      name="doctorDetail"
      options={{title:"Doctor Detail",headerShown:true}}
      component={DoctorDetail}
      />
      <Stack.Screen
      name="searchRecord"
      options={{title:"Result"}}
      component={SearchRecords}
      />
      <Stack.Screen
      name="bookAppointment"
      options={{title:"Book Appointment"}}
      component={BookAppointment}
      />
      <Stack.Screen
      name="search"
      options={{title:"search"}}
      component={Search}
      />
    </Stack.Navigator>
  )
}
function ChatRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor:"#fff",
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="chat"
      options={{title:"Chat"}}
      component={Chat}
      />
      <Stack.Screen
      name="chatBoard"
      options={{title:"Loading"}}
      component={chatBoard}
      />
    </Stack.Navigator>
  )
}
function DoctorRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor:"#fff",
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="doctor"
      options={{title:"Doctor",headerShown:true}}
      component={Doctor}
      />
      <Stack.Screen
      name="search"
      options={{title:"search"}}
      component={Search}
      />
      <Stack.Screen
      name="searchRecord"
      options={{title:"Result"}}
      component={SearchRecords}
      />
      <Stack.Screen
      name="doctorDetail"
      options={{title:"Doctor Detail",headerShown:true}}
      component={DoctorDetail}
      />
      <Stack.Screen
      name="bookAppointment"
      options={{title:"Book Appointment"}}
      component={BookAppointment}
      />
    </Stack.Navigator>
  )
}
// function SearchRoutes(){
//   return(
//     <Stack.Navigator
//     screenOptions={{
//       headerTintColor:"#fff",
//       headerBackground:()=><View style={{backgroundColor:'#ebf1f5',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
//     }}
//     >
//       <Stack.Screen
//       name="search"
//       options={{title:"search"}}
//       component={Search}
//       />
//       <Stack.Screen
//       name="searchRecord"
//       options={{title:"Result"}}
//       component={SearchRecords}
//       />
//       <Stack.Screen
//       name="doctorDetail"
//       options={{title:"Doctor Detail",headerShown:true}}
//       component={DoctorDetail}
//       />
//       <Stack.Screen
//       name="bookAppointment"
//       options={{title:"Book Appointment"}}
//       component={BookAppointment}
//       />
//     </Stack.Navigator>
//   )
// }
function NotiRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor:"#fff",
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="notification"
      options={{title:"Notification"}}
      component={Notification}
      />
    </Stack.Navigator>
  )
}
function AppointmentRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor: '#fff',
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="appointment"
      options={{title:"Appointment"}}
      component={AppointMents}
      />
      <Stack.Screen
      name="chatBoard"
      options={{title:"Loading"}}
      component={chatBoard}
      />
    </Stack.Navigator>
  )
}
function ProfileRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor: '#fff',
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="profile"
      options={{title:"Profile"}}
      component={Profile}
      />
    </Stack.Navigator>
  )
}

function Tabs(initialRoute){
  return (
      <Tab.Navigator
      tabBarOptions={{
        labelStyle:{
          marginBottom:2
        },
        activeTintColor:'white',
        style:{
          borderTopRightRadius:responsiveFontSize(3),
          borderTopLeftRadius:responsiveFontSize(3)
        }
      }}
      initialRouteName={initialRoute}
      >

      <Tab.Screen 
      options={{
        title:"Home",
        tabBarIcon:({color})=><HomeIcon name="home" size={20} color={color}/>
      }}
      name="home" 
      component={HomeRoutes} />

      <Tab.Screen 
      options={{
        title:"Doctor",
        tabBarIcon:({color})=><DoctorIcon name="doctor" size={20} color={color}/>
      }}
      name="doctor" 
      component={DoctorRoutes} />
      <Tab.Screen 
      options={{
        title:"Notification",
        tabBarIcon:({color})=><NotiIcon name="notification" size={20} color={color}/>
      }}
      name="notification" 
      component={NotiRoutes} />
      <Tab.Screen 
      options={{
        title:"Appointment",
        tabBarIcon:({color})=><AppointmentIcon name="event-note" size={20} color={color}/>
      }}
      name="appointment" 
      component={AppointmentRoutes} />

      <Tab.Screen 
      options={{
        title:"Chat",
        tabBarIcon:({color})=><NotiIcon name="message1" size={20} color={color}/>
      }}
      name="chat" 

      component={ChatRoutes} />
      
      <Tab.Screen 
      options={{
        title:"Profile",
        tabBarIcon:({color})=><ProfileIcon name="user-circle" size={20} color={color}/>
      }}
      name="profile" 

      component={ProfileRoutes} />
      </Tab.Navigator>
  );
}


function DoctorHomeRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor: '#fff',
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    
    >
      <Stack.Screen
      name="doctorHome"
      options={{title:"Home"}}
      component={DoctorHome}
      />
      <Stack.Screen
      name="chatBoard"
      options={{title:"Loading"}}
      component={chatBoard}
      />
    </Stack.Navigator>
  )
}


function DoctorAppointmentRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor: '#fff',
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="doctorAppointment"
      options={{title:"Appointment"}}
      component={DoctorAppoint}
      />
      <Stack.Screen
      name="chatBoard"
      options={{title:"Loading"}}
      component={chatBoard}
      />
    </Stack.Navigator>
  )
}

function DoctorProfileRoutes(){
  return(
    <Stack.Navigator
    screenOptions={{
      headerTintColor: '#fff',
      headerBackground:()=><View style={{backgroundColor:'#0097e1',flex:1,borderBottomRightRadius:responsiveFontSize(3),borderBottomLeftRadius:responsiveFontSize(3)}}/>
    }}
    >
      <Stack.Screen
      name="profile"
      options={{title:"Profile"}}
      component={DoctorProfile}
      />
    </Stack.Navigator>
  )
}


function DoctorTabs(initialRoute){
  return (
      <Tab.Navigator
      tabBarOptions={{
        labelStyle:{
          marginBottom:2
        },
        activeTintColor:'white',
        style:{
          borderTopRightRadius:responsiveFontSize(3),
          borderTopLeftRadius:responsiveFontSize(3)
        }
      }}
      initialRouteName={initialRoute}
      >

      <Tab.Screen 
      options={{
        title:"Home",
        tabBarIcon:({color})=><HomeIcon name="home" size={20} color={color}/>
      }}
      name="home" 
      component={DoctorHomeRoutes} />
      <Tab.Screen 
      options={{
        title:"Appointment",
        tabBarIcon:({color})=><AppointmentIcon name="event-note" size={20} color={color}/>
      }}
      name="appointment" 
      component={DoctorAppointmentRoutes} />
      <Tab.Screen 
      options={{
        title:"Profile",
        tabBarIcon:({color})=><ProfileIcon name="user-circle" size={20} color={color}/>
      }}
      name="profile" 
      component={DoctorProfileRoutes} />
      <Tab.Screen 
      options={{
        title:"Chat",
        tabBarIcon:({color})=><NotiIcon name="message1" size={20} color={color}/>
      }}
      name="chat" 
      component={ChatRoutes} />

      </Tab.Navigator>
  );
}

//call
const requestCameraAndAudioPermission = async () =>{
  try {
      const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ])
      if (
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
          && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
          console.log('You can use the cameras & mic')
      } else {
          console.log('Permission denied')
      }
  } catch (err) {
      console.warn(err)
  }
}



function Routes({theme,getToken,user,setUserOnload,getChatUsers,setMobileToken,setOnlineStatus,recieved,changeRecieved,rejectCall,setCalling}){
  const navigation=useRef(null)
  const [loading,setLoading]=useState(true)
  const [initialRoute, setInitialRoute] = useState('home');
  //call
  const appId='42ee6fd415a64032bcad2f6ff835e396';
  const [peerIds,setPeerIds]=useState([]);
  const [joinSucceed,setJoinSucceed]=useState(false)
  const [remoteUser,setRemoteUser]=useState(null)
  const [token,setToken]=useState('00642ee6fd415a64032bcad2f6ff835e396IACPrz8LlcuixDYSr6JrbDMLwI5FxzhJ/jDdHSvVHj4uUmrzwB8AAAAAEADVsuWc8movYQEAAQDxai9h')
  //call
  if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
          console.log('requested!')
      })
  }

  useEffect(()=>{
    const options = {
      ios: {
        appName: 'ReactNativeWazoDemo',
        imageName: 'sim_icon',
        supportsVideo: false,
        maximumCallGroups: '1',
        maximumCallsPerCallGroup: '1'
      },
      android: {
        alertTitle: 'Permissions Required',
        alertDescription:
          'This application needs to access your phone calling accounts to make calls',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'sim_icon',
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
      }
    };
       RNCallKeep.setup(options);
       RNCallKeep.setAvailable(true); // Only used for Android, see doc above.

    AppState.addEventListener('change', 
    handleAppStateChange);
    getUser()
    messaging()
      .subscribeToTopic('ecomerce')
      .then(() => console.log('Subscribed to topic!'));

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        if(navigation.current){
          navigation.current.navigate("notification")
        }
      });
  
      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            setInitialRoute("notification"); // e.g. "Settings"
          }
        });
          // Register background handler
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            if(remoteMessage.data.data){
              // RNCallKeep.backToForeground()
              const data=JSON.parse(remoteMessage.data.data)
              RNCallKeep.addEventListener('endCall',({callUUID})=>{
                rejectCall(data.mobileToken,data.caller.id.toString())
                RNCallKeep.endCall(callUUID)
                // RNCallKeep.removeEventListener('answerCall')
                // RNCallKeep.removeEventListener('endCall')
              })
              if(data.cancel){
                setCalling(false)
                endCall(data.id.toString())
                return
              }
              if(data.caller){
                setRemoteUser(data)
                console.log("displaaaaaayyyyyyyyyyyyyyyy")
                RNCallKeep.displayIncomingCall(data.callee.id.toString(),data.caller.name,"calling","generic",false, {channel:data.channel});
              }
            }
          });
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          if(remoteMessage.data.data){
            const data=JSON.parse(remoteMessage.data.data)
          if(remoteMessage.data.data){
            if(data.cancel){
              setCalling(false)
              endCall()
              return
            }
            console.log("tt",data)
            setRemoteUser(JSON.parse(remoteMessage.data.data))
            setJoinSucceed(true)
            return
          }
          }
            PushNotification.localNotification({
            channelId: "channel-id",
            channelName: "My channel",
            message:remoteMessage.notification.body,
            playSound:true,
            title:remoteMessage.notification.title,
            priority:'high',
            soundName:'default',
            
          })
        });
  },[])

  const handleAppStateChange = (nextAppState) => {
    console.log("nexApp",nextAppState)
    if (nextAppState === 'inactive') {
    console.log('the app is closed');
   }    
  }
  function updateToken(userForToken){
    const {
      role,
      user_id
    }=userForToken
    const uRole=(role=="Dr"?'DR':"PR")
    getToken(user_id,uRole).then(res=>{
      AsyncStorage.setItem('user',JSON.stringify({...userForToken,mobile_token:res.mobileToken}))
    })
  }

 async function getUser(){
    let existUser=await AsyncStorage.getItem('user');
    existUser=JSON.parse(existUser)
    console.log('existUser',existUser)
    setLoading(false)
    if(existUser){
      updateToken(existUser)
      config(existUser)
      callKeepsetup(existUser)
      const name=existUser.role=="Dr"?existUser.first_name:`${existUser.first_name} ${existUser.last_name}`
      const userInfo={
        id:existUser.user_id,
        name:name,
        status:"online"
    }
      setUserOnload(existUser)
      requestUserPermission(existUser)
      console.log('ex',existUser)
      getChatUsers(name,existUser.user_id)
     setOnlineStatus(userInfo)
    }
    setLoading(false)
  }

  async function requestUserPermission(user) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      const token=await messaging().getToken()
      console.log("firebaseToken",token)
      setMobileToken(token,user)
    }
  }

  const _renderRemoteVideos = () => {
    return (
        <ScrollView
            style={styles.remoteContainer}
            contentContainerStyle={{paddingHorizontal: 2.5}}
            horizontal={true}>
            {peerIds.map((value, index, array) => {
                return (
                    <RtcRemoteView.SurfaceView
                        key={index}
                        style={styles.remote}
                        uid={value}
                        channelId={user.role=="Dr"?`${user.user_id}d`:`${user.user_id}p`}
                        renderMode={VideoRenderMode.Hidden}
                        zOrderMediaOverlay={true}/>
                )
            })}
        </ScrollView>
    )
}

async function config(user){
  //call

  const _engine = await RtcEngine.create(appId)
  // Enable the video module.
  await _engine.enableVideo()
  await _engine.enableAudio()
  await _engine.setEnableSpeakerphone(true)
  // Listen for the UserJoined callback.
  // This callback occurs when the remote user successfully joins the channel.
  _engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed)
      if (peerIds.indexOf(uid) === -1) {
        const updatedPeer=[...peerIds, uid]
        setPeerIds(updatedPeer)
        setJoinSucceed(true)
      }
  })

  // Listen for the UserOffline callback.
  // This callback occurs when the remote user leaves the channel or drops offline.
  _engine.addListener('UserOffline', async(uid, reason) => {
      console.log('UserOffline', uid, reason)
      const updatedPeer=[...peerIds].filter(id => id !== uid)
      setPeerIds(updatedPeer)
      setJoinSucceed(false)
      _engine.leaveChannel().then(()=>{
        changeRecieved(false)
        RNCallKeep.endAllCalls()
      })
  })
  _engine.addListener('ConnectionLost',async()=>{
    await _engine.leaveChannel()
  })

  // Listen for the JoinChannelSuccess callback.
  // This callback occurs when the local user successfully joins the channel.
  _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed)
  })

}

const callKeepsetup = async(eUser) => {
  RNCallKeep.addEventListener('answerCall', async({callUUID})=>{
    console.log("oppstion",callUUID)
    if (Platform.OS === "android") {
      const { CallkeepHelperModule } = NativeModules;
      CallkeepHelperModule.startActivity()
    }
    setJoinSucceed(true)
    changeRecieved(true)
    joinLocalUser({user_id:callUUID.toString()},callUUID.toString()+(eUser.role=="Dr"?"d":"p"))
    // RNCallKeep.endCall(callUUID.toString())
    // RNCallKeep.removeEventListener('answerCall')
    // RNCallKeep.removeEventListener('endCall')
    // RNCallKeep.backToForeground()
  });
}

async function joinLocalUser(userE,channel){
  const _engine = await RtcEngine.create(appId)
  axios.post('https://webprojectmockup.com:9449/api/user/tokenGenerate',{
  uid:Number(userE.user_id),
  isPublisher:true,
  channel:channel
  }).then(async(res)=>{
    const {data}=res.data
    console.log("apisdfdf",data)

      await _engine.joinChannel(data.token, channel, null, data.uid)
  
  })
  
}

async function endCall(){
  const _engine = await RtcEngine.create(appId)
  _engine.leaveChannel()
  setJoinSucceed(false)
  changeRecieved(false)
  RNCallKeep.endAllCalls()
}
  
  if(loading){
    return <Loader color="#0097e1"/>
  }else{
    if(joinSucceed){
      if(recieved){
        return(
          <View style={styles.fullView}>
            {_renderRemoteVideos()}
              <RtcLocalView.SurfaceView
                  style={styles.max}
                  channelId={user.role=="Dr"?`${user.user_id}d`:`${user.user_id}p`}
                  />
              <TouchableOpacity
              onPress={()=>endCall()}
              style={{
                position:'absolute',
                right:(width/2)-40,
                bottom:responsiveFontSize(4),
                backgroundColor:'red',
                width:80,height:80,
                justifyContent:'center',
                alignItems:'center',
                borderRadius:40}}
              >
                <Text style={{color:'white'}}>End Call</Text>
              </TouchableOpacity>
          </View>
        )
      }else{
        return <IncommingCall
        rec={()=>{
          changeRecieved(true)
          joinLocalUser({user_id:remoteUser.id},remoteUser.channel)
        }}
        userInfo={remoteUser}
        rej={()=>{
          endCall()
          rejectCall(remoteUser.mobileToken,remoteUser.caller.id.toString())
        }}
        />
      }
    }else{
      return(
        <NavigationContainer 
        ref={navigation}
        theme={theme=="dark"?darkTheme:MyTheme}>
          {user.user_id?(
            user.role=="Dr"?DoctorTabs(initialRoute):Tabs(initialRoute)
          ):AuthRoutes()}
        </NavigationContainer>
      )
    }
  }
}

function mapStateToProps({user,recieved}){
  return {user,recieved}
}

export default connect(mapStateToProps,actions)(Routes);

