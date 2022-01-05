import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image, ScrollView, ImageBackground} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize,
    responsiveHeight
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux"
import DoctorIcon from "react-native-vector-icons/Fontisto"
import AmountIcon from "react-native-vector-icons/MaterialIcons"
import AppointmentIcon from "react-native-vector-icons/MaterialCommunityIcons"
import CallIcon from "react-native-vector-icons/Ionicons";
import VideoIcon from "react-native-vector-icons/FontAwesome";
import MessageIcon from "react-native-vector-icons/Entypo";
import {ProgressChart} from "react-native-chart-kit";
import {imgBaseUrl} from "../../config/config.json";
import {joinCall} from "../../utils/joinCall"
import axios from "axios";  
import StartCalling from "../videoCall/startCall";
import RtcEngine from 'react-native-agora'
import firestore from '@react-native-firebase/firestore';


const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    color: (opacity) => {
        console.log('op',opacity)
        return `rgba(46, 182, 255, ${opacity})`
    },
    propsForBackgroundLines:{},
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const data = {
    labels: ["Month", "Patient", "Appointments"],
    colors:["green","yellow","blue"]
  };

function DoctorHome ({navigation,getDashBoard,dashboard,user,changeRecieved,callRequest,rejectCall}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)

    const [calling,setCalling]=useState(false)
    const [calleeInfo,setCalleeInfo]=useState(false)

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:'white',fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>,
            headerRight: () => (
                <TouchableOpacity 
                onPress={()=>navigation.jumpTo('profile')}
                style={{paddingRight:responsiveWidth(5)}}>
                    <ProfileIcon name="user-circle" size={22} color='white'/>
                </TouchableOpacity>
            )
            
          });
    },[navigation])
    
    useEffect(()=>{
        config()
        getDashBoard(user.user_id).then(()=>{
            setLoading(false)
        })
    },[])
    async function config(){
        const appId='42ee6fd415a64032bcad2f6ff835e396';
        const _engine = await RtcEngine.create(appId)
        _engine.addListener('UserJoined', (uid, elapsed) => {
            setCalling(false)
        })
    }
    function callUser(id){
        firestore().collection('calls').doc(id.toString()).onSnapshot((res)=>{
            if(res.exists){
             setCalling(true)
            }else{
                setCalling(false)
            }
         })
    }


    function renderAppointment({item}){
        const {
            appointment_date,
            first_name,
            last_name,
            mobile_token,
            appointment_time,
            day,
            user_id,
        }=item

        return(
            <View style={styles.appCon}>
                <Image
                source={{uri:item.user_image?imgBaseUrl+item.user_image:localImage}}
                style={{
                    width:responsiveFontSize(7),
                    height:responsiveFontSize(7),
                    borderRadius:responsiveFontSize(7)/2,
                }}
                />
                <Text style={{fontSize:responsiveFontSize(1.5),color:colors.text,fontFamily:'Montserrat-Medium',marginVertical:responsiveFontSize(1)}}>{first_name} {last_name}</Text>
                <Text style={{fontFamily:'Montserrat-Medium',color:'#fab701',textTransform:'uppercase'}}>{day.slice(0,3)} {appointment_time}</Text>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:responsiveFontSize(1)}}>
                            <TouchableOpacity style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <CallIcon
                                name="call"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>{
                                setCalleeInfo({
                                    img:item.user_image?imgBaseUrl+item.user_image:localImage,
                                    name:item.first_name+" "+item.last_name,
                                    id:item.user_id,
                                    role:'Patient'
                                })
                                setCalling(true)
                                changeRecieved(true)
                                axios.post('https://webprojectmockup.com:9449/api/user/tokenGenerate',{
                                uid:item.dr_id,
                                isPublisher:true,
                                channel:`${item.user_id}p`
                                }).then((res)=>{
                                    console.log(res.data)
                                    const {data}=res.data
                                    joinCall(data.token,`${item.user_id}p`,data.uid).then(()=>{
                                        callRequest({
                                            id:item.user_id,
                                            channel:`${item.user_id}p`,
                                            caller:{
                                                img:imgBaseUrl+user.user_image,
                                                name:user.first_name,
                                                id:item.dr_id,
                                                role:'Doctor'
                                            },
                                            callee:{
                                                img:item.user_image?imgBaseUrl+item.user_image:localImage,
                                                name:item.first_name+" "+item.last_name,
                                                id:item.user_id,
                                                role:'Patient'
                                            }
                                        },()=>callUser(item.user_id))
                                    })
                                })
                            }}
                            style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <VideoIcon
                                name="video-camera"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>{
                                navigation.push('chatBoard',{
                                        sId:user.user_id.toString(),
                                        rId:user_id.toString(),
                                        sName:user.first_name,
                                        sImage:"https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com%20C/O%20https://placeholder.com/",
                                        rec:{
                                            name:`${first_name} ${last_name}`,
                                            mobile_token:mobile_token,
                                            image:item.user_image?item.user_image:localImage
                                        }
                                })
                            }}
                            style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <MessageIcon
                                name="message"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                </View>
                <View style={{marginTop:responsiveFontSize(1)}}>
                    <Text>{appointment_date.slice(0,10)}</Text>
                </View>
            </View>
        )
    }
    if(loading){
        return <Loader/>
    }else{
        return(
            <ScrollView style={{flex:1}}>
                <StartCalling
                rej={async()=>{
                    const appId='42ee6fd415a64032bcad2f6ff835e396';
                    const _engine = await RtcEngine.create(appId)
                    _engine.leaveChannel()
                    setCalling(false)
                    rejectCall(calleeInfo.id.toString())
                    
                }}
                calling={calling}
                userInfo={calleeInfo}
                />
                <View style={{flex:1}}>
                    <View style={{justifyContent:'center',alignItems:'center',marginBottom:responsiveFontSize(2)}}>
                        <ProgressChart
                        data={{...data,data:[((parseInt(dashboard.total_amount)/10000)*100)/100,((parseInt(dashboard.totalThisMonthappointmentCount)/30)*100)/100,((parseInt(dashboard.todayAppointment.length)/100)*100)/100]}}

                        width={responsiveWidth(97)}
                        height={responsiveHeight(25)}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig}
                        hideLegend={false}
                        />
                        </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <View style={{backgroundColor:'#3acbf0',width:'30%',paddingTop:responsiveFontSize(0.7),borderRadius:responsiveFontSize(1)}}>
                            <Text style={{color:'white',fontSize:responsiveFontSize(1.2),fontWeight:'700',textAlign:'center'}}>MONTHLY AMOUNT</Text>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',padding:responsiveFontSize(2)}}>
                            <AmountIcon
                            name="attach-money"
                            color="white"
                            size={responsiveFontSize(4.5)}
                            />
                            <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700',color:'white',marginRight:responsiveFontSize(1.5)}}>{dashboard.total_amount}</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor:'#fce232',width:'30%',paddingTop:responsiveFontSize(0.7),borderRadius:responsiveFontSize(1)}}>
                            <Text style={{color:'white',fontSize:responsiveFontSize(1.2),fontWeight:'700',textAlign:'center'}}>MONTHLY PATIENTS</Text>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',padding:responsiveFontSize(1)}}>
                            <AmountIcon
                            name="sick"
                            color="white"
                            size={responsiveFontSize(4.5)}
                            />
                            <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700',color:'white',marginLeft:responsiveFontSize(0.5)}}>{dashboard.totalThisMonthappointmentCount}</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor:'#e31be3',width:'30%',paddingTop:responsiveFontSize(0.7),borderRadius:responsiveFontSize(1)}}>
                            <Text style={{color:'white',fontSize:responsiveFontSize(1.2),fontWeight:'700',textAlign:'center'}}>TODY APPOINTMENT</Text>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',padding:responsiveFontSize(1)}}>
                            <AppointmentIcon
                            name="file-document-edit"
                            color="white"
                            size={responsiveFontSize(4)}
                            />
                            <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700',color:'white',marginRight:responsiveFontSize(1.5)}}>{dashboard.todayAppointment.length}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{color:"grey",...styles.heading,fontSize:responsiveFontSize(2.5),marginTop:responsiveFontSize(1)}}>
                        Today Appointments
                    </Text>
                    <FlatList
                    data={dashboard.todayAppointment}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderAppointment}
                    keyExtractor={(item,i)=>i.toString()}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    heading:{
        fontSize:responsiveFontSize(3),
        fontFamily:'Montserrat-Bold',
        padding:responsiveFontSize(2)
    },
    appCon:{
        backgroundColor:'white',
        padding:responsiveFontSize(2),
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius:responsiveFontSize(1),
        margin:responsiveFontSize(1)
    }
})

function mapStateToProps({dashboard,user}){
    return {
        dashboard,
        user
    }
}

export default connect(mapStateToProps,actions)(DoctorHome);
