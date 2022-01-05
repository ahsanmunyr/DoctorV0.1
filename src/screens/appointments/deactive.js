import { useTheme } from "@react-navigation/native";
import React,{useState,useEffect} from "react";
import {View,Text, FlatList,StyleSheet,Image,TouchableOpacity} from "react-native";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import formatDate from "../../utils/formatDate";
import CallIcon from "react-native-vector-icons/Ionicons";
import VideoIcon from "react-native-vector-icons/FontAwesome";
import MessageIcon from "react-native-vector-icons/Entypo";
import {imgBaseUrl} from "../../config/config.json"
import { connect } from "react-redux";
import {joinCall} from "../../utils/joinCall"
import axios from "axios";  
import * as actions from "../../store/action"
import StartCalling from "../videoCall/startCall";
import RtcEngine from 'react-native-agora'
import firestore from '@react-native-firebase/firestore';

const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"


function Deactive({navigation,data,user,changeRecieved,callRequest,rejectCall,setCalling,calling}){
    const {colors}=useTheme()
    const getDay=["SUN","MON","TUE","WED","THU","FRI","SAT"]
    const [calleeInfo,setCalleeInfo]=useState(false)
    useEffect(()=>{
        config()
    },[])
    async function config(){
        const appId='42ee6fd415a64032bcad2f6ff835e396';
        const _engine = await RtcEngine.create(appId)
        _engine.addListener('UserJoined', (uid, elapsed) => {
            setCalling(false)
        })
    }

    function renderAppointment({item}){
        return(
            <View style={styles.con}>
                <View style={styles.left}>
                    <Image
                    source={{uri:item.user_image?imgBaseUrl+item.user_image:localImage}}
                    style={styles.img}
                    />
                    <Text style={{textAlign:'center',fontSize:responsiveFontSize(1.5),color:'grey'}}>{item.name}</Text>
                </View>
                <View style={styles.right}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:responsiveFontSize(1.5),color:colors.text}}>{item.dr_name}</Text>
                    <Text style={{fontSize:responsiveFontSize(1.2),color:'green',marginRight:responsiveFontSize(3)}}>${item.amount}</Text>
                    </View>
                    <Text style={{color:'#5fb514',fontSize:responsiveFontSize(2.5),fontWeight:'700',marginVertical:responsiveFontSize(0.5),textTransform:"uppercase"}}>{item.day.slice(0,3)+" "+item.appointment_time}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View>
                            <Text style={{fontSize:responsiveFontSize(1.2),color:'grey'}}>ID: {item.payment_id.slice(0,10)}</Text>
                            <Text style={{fontSize:responsiveFontSize(1.2),color:'grey',marginRight:responsiveFontSize(3)}}>{item.appointment_date.slice(0,10)}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginVertical:responsiveFontSize(1)}}>
                            {/* <TouchableOpacity style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <CallIcon
                                name="call"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity> */}
                            <TouchableOpacity 
                            onPress={()=>{
                                setCalleeInfo({
                                    img:item.user_image?imgBaseUrl+item.user_image:localImage,
                                    name:item.dr_name,
                                    id:item.dr_id,
                                    role:'Doctor',
                                    mobileToken:item.mobile_token
                                })
                                setCalling(true)
                                changeRecieved(true)
                                axios.post('https://webprojectmockup.com:9449/api/user/tokenGenerate',{
                                uid:user.user_id,
                                isPublisher:true,
                                channel:`${item.dr_id}d`
                                }).then((res)=>{
                                    console.log(res.data)
                                    const {data}=res.data
                                    joinCall(data.token,`${item.dr_id}d`,data.uid).then(()=>{
                                        callRequest({
                                            id:item.dr_id,
                                            channel:`${item.dr_id}d`,
                                            caller:{
                                                img:imgBaseUrl+user.user_image,
                                                name:user.first_name+" "+user.last_name,
                                                id:user.user_id,
                                                role:'Patient'
                                            },
                                            mobileToken:user.mobile_token,
                                            callee:{
                                                img:item.user_image?imgBaseUrl+item.user_image:localImage,
                                                name:item.dr_name,
                                                id:item.dr_id,
                                                role:'Doctor'
                                            }
                                        },item.mobile_token)
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
                                        rId:item.dctor_id.toString(),
                                        sName:user.first_name+" "+user.last_name,
                                        sImage:user.user_image?imgBaseUrl+user.user_image:localImage,
                                        rec:{
                                            name:item.dr_name,
                                            mobile_token:item.mobile_token,
                                            image:item.user_image?imgBaseUrl+item.user_image:localImage
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
                    </View>
                </View>
            </View>
        )
    }
    return(
        <>
            <StartCalling
            rej={async()=>{
                const appId='42ee6fd415a64032bcad2f6ff835e396';
                const _engine = await RtcEngine.create(appId)
                await _engine.leaveChannel()
                setCalling(false)
                changeRecieved(false)
                rejectCall(calleeInfo.mobileToken,calleeInfo.id)
                
            }}
            calling={calling}
            userInfo={calleeInfo}
            />
            {data.length>0?(
                <FlatList
                style={{flex:1,marginTop:responsiveFontSize(1)}}
                data={data}
                renderItem={renderAppointment}
                keyExtractor={(item,i)=>i.toString()}
                />
            ):(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700'}}>Not Found</Text>
                </View>
            )}
    </>
    )
}

const styles=StyleSheet.create({
    con:{
        backgroundColor:'white',
        marginVertical:responsiveFontSize(0.75),
        width:'95%',
        marginLeft:'auto',
        marginRight:'auto',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:responsiveFontSize(1),
        padding:responsiveFontSize(1),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    left:{
        width:'30%',
        padding:responsiveFontSize(1),
        justifyContent:'center',
        alignItems:'center',
    },
    right:{
        width:'70%'
    },
    img:{
        width:responsiveFontSize(7),
        height:responsiveFontSize(7),
        borderRadius:responsiveFontSize(7)/2
    }
})
function mapStateToProps({user,calling}){
    return {user,calling}
}
export default connect(mapStateToProps,actions)(Deactive)