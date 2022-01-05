import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image,ScrollView} from 'react-native';
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
import CallIcon from "react-native-vector-icons/Ionicons";
import VideoIcon from "react-native-vector-icons/FontAwesome";
import MessageIcon from "react-native-vector-icons/Entypo"
import DoctorComponent from '../../components/doctor';
import Btn from '../../components/btn';
import {imgBaseUrl} from "../../config/config.json"

const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"

function Doctor ({navigation,getDoctorDetail,doctorDetail,route}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)
    const [timings,setTimings]=useState([])


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:"white",fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>,
            headerTintColor:"white",
            headerRight: () => (
                <TouchableOpacity 
                onPress={()=>navigation.jumpTo('profile')}
                style={{paddingRight:responsiveWidth(5)}}>
                    <ProfileIcon name="user-circle" size={22} color={"white"}/>
                </TouchableOpacity>
            ),
            
          });
    },[navigation])
    
    useEffect(()=>{
      getDoctorDetail(route.params.id).then(()=>{
        setLoading(false)
      })
    },[])

    const doctorDetailMemo=useMemo(()=>{
        if(doctorDetail.timings){
            const updatedData=doctorDetail.timings.map((item,i)=>{
                return {...item,active:(i==0?true:false)}
            })
            setTimings(updatedData)
        }
    },[doctorDetail])

    function renderDays(){
        return timings.map(item=>{
            return (
                <TouchableOpacity 
                key={item.id}
                onPress={()=>{
                    const updatedData=timings.map((subItem)=>{
                        return {...subItem,active:item.id==subItem.id?true:false}
                    })
                    setTimings(updatedData)
                }}
                style={{...styles.day,backgroundColor:item.active?'#fab701':'rgba(13, 59, 128, 0.1)'}}>
                    <Text style={{color:item.active?'white':colors.text,fontSize:responsiveFontSize(1.2)}}>
                        {item.day.slice(0,3)}
                    </Text>
                </TouchableOpacity>
            )
        })
    }
    function renderTiming(id){
        const seletedDay=timings.filter((item)=>item.active)
            return(
                <>
                <View style={styles.time}>
                    <Text style={{color:colors.text,fontSize:responsiveFontSize(1.2)}}>{seletedDay[0].start_time}</Text>
                </View>
                <Text style={{color:'grey',marginHorizontal:responsiveFontSize(2)}}>to</Text>
                <View style={styles.time}>
                    <Text style={{color:colors.text,fontSize:responsiveFontSize(1.2)}}>{seletedDay[0].end_time}</Text>
                </View>
                </>
            )
        
    }
    function onBookAppointment(){
        navigation.push('bookAppointment',{doctorDetail})
    }

    if(loading){
        return <Loader/>
    }else{
        const {
            dr_name,
            name,
            fee,
            description,
            user_image
        }=doctorDetail
        return(
            <View style={{flex:1,paddingHorizontal:responsiveFontSize(4),paddingVertical:responsiveFontSize(3)}}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-start'}}>
                    <View style={{width:'50%'}}>
                        <View style={styles.img}>
                            <Image
                            style={{width:responsiveFontSize(16),height:responsiveFontSize(16),borderRadius:responsiveFontSize(2)}}
                            source={{uri:user_image?imgBaseUrl+user_image:localImage}}
                            />
                        </View>
                    </View>
                    <View style={{width:'50%'}}>
                        <Text style={{color:colors.text,...styles.heading}}>
                            {dr_name}
                        </Text>
                        <Text style={styles.sub}>
                            {name}
                        </Text>
                        <Text style={styles.sub}>
                            Fee: ${fee}
                        </Text>
                        {/* <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:responsiveFontSize(1)}}>
                            <TouchableOpacity style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <CallIcon
                                name="call"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <VideoIcon
                                name="video-camera"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'#fab701',width:responsiveFontSize(3.5),height:responsiveFontSize(3.5),borderRadius:responsiveFontSize(3.5)/2,justifyContent:'center',alignItems:'center',marginRight:responsiveFontSize(1.5)}}>
                                <MessageIcon
                                name="message"
                                size={responsiveFontSize(1.75)}
                                color="white"
                                />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
                <View style={{marginVertical:responsiveFontSize(2)}}>
                    <Text style={styles.des}>{description}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',...styles.days}}>
                    {renderDays()}
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap',width:'100%',marginVertical:responsiveFontSize(2),justifyContent:'center',alignItems:'center'}}>
                    {renderTiming()}
                </View>
                <View style={{marginBottom:responsiveFontSize(2)}}>
                    <Btn
                    text="Book Appointment"
                    color="#fab701"
                    call={onBookAppointment}
                    />
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    heading:{
        fontSize:responsiveFontSize(2.75),
        fontFamily:'Montserrat-Bold',
    },
    day:{
        width:responsiveWidth(10),
        borderRadius:responsiveFontSize(0.75),
        height:responsiveHeight(3),
        justifyContent:'center',
        alignItems:'center'
    },
    time:{
        borderRadius:responsiveFontSize(0.75),
        paddingHorizontal:responsiveFontSize(2),
        paddingVertical:responsiveFontSize(0.5),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(13, 59, 128, 0.1)',
        marginHorizontal:responsiveFontSize(0.5),
        marginVertical:responsiveFontSize(0.5)
    },
    days:{
        backgroundColor:'white',
        padding:responsiveFontSize(1),
        paddingVertical:responsiveFontSize(2),
        borderRadius:responsiveFontSize(1),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    sub:{
        color:'grey',
        fontSize:responsiveFontSize(1.5)
    },
    des:{
        color:'grey',
        fontSize:responsiveFontSize(1.5),
        textAlign:'justify'
    },
    img:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        backgroundColor:'white',
        width:responsiveFontSize(16),
        height:responsiveFontSize(16),
        borderRadius:responsiveFontSize(2)
    }
})

function mapStateToProps({doctorDetail}){
    return {
        doctorDetail
    }
}

export default connect(mapStateToProps,actions)(Doctor);
