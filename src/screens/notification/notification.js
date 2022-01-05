import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image} from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import LogoutIcon from "react-native-vector-icons/AntDesign";
import {useTheme} from "@react-navigation/native";
import NotifyModel from '../../components/notifyModel';
import NotFoundIcon from "react-native-vector-icons/AntDesign";
import * as actions from "../../store/action";
import {connect} from "react-redux"
import AsyncStorage from '@react-native-community/async-storage';

function Notification ({navigation,notifications,getNotifications}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)
    const [model,setModel]=useState(false)
    const [modelData,setModelData]=useState({})


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:"white",fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>,
            headerRight: () => (
                <TouchableOpacity 
                onPress={()=>navigation.jumpTo('profile')}
                style={{paddingRight:responsiveWidth(5)}}>
                    <ProfileIcon name="user-circle" size={22} color={"white"}/>
                </TouchableOpacity>
            )
            
          });
    },[navigation])

    useEffect(()=>{
        AsyncStorage.getItem('user').then((res)=>{
            res=JSON.parse(res)
            getNotifications(res.user_id).then(()=>{
                setLoading(false)
            })
        })
    },[])
    
    function renderProduct({item}){
        return(
            <TouchableOpacity 
            onPress={()=>{
                setModelData({
                    title:item.title,
                    des:item.description
                })
                setModel(true)
            }}
            activeOpacity={0.7} style={{...styles.con,backgroundColor:colors.background}}>
                <View style={{justifyContent:'center',alignItems:'center',width:'25%'}}>
                    <LogoutIcon
                    name="notification"
                    size={30}
                    color={colors.card}
                    />
                </View>
                <View style={{justifyContent:'center',width:'50%'}}>
                    <Text style={{color:colors.card,fontFamily:'Montserrat-Medium'}}>{item.title.length>20?item.title.slice(0,20)+"...":item.title}</Text>
                    <Text style={{fontSize:responsiveFontSize(1.5),textAlign:'left',color:'grey'}}>{item.description.length>40?item.description.slice(0,40)+"...":item.description}</Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',width:'25%'}}>
                <LogoutIcon
                    name="doubleright"
                    size={30}
                    color={"#c5c5c5"}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    if(loading){
        return <Loader/>
    }else{
        return(
            <View style={{flex:1}}>
                <NotifyModel
                visible={model}
                closeModle={()=>setModel(false)}
                des={modelData.des}
                title={modelData.title}
                />
                {notifications.length>0?(
                    <FlatList
                    contentContainerStyle={{paddingBottom:responsiveFontSize(1),alignItems:'center',paddingHorizontal:responsiveFontSize(1)}}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    renderItem={renderProduct}
                    keyExtractor={(item,i)=>i.toString()}
                    />
                ):(
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <NotFoundIcon
                        name="search1"
                        size={responsiveFontSize(10)}
                        color="grey"
                        />
                        <Text style={{fontSize:responsiveFontSize(5),color:'grey',fontFamily:'Montserrat-Bold'}}>Not Found</Text>
                    </View>
                )}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    con:{
        width:'100%',
        flexDirection:'row',
        marginVertical:responsiveFontSize(1),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        marginLeft:'auto',
        marginRight:'auto',
        elevation: 10,
        borderRadius:responsiveFontSize(1),
        height:responsiveHeight(12)
    }
})


function mapStateToProps({notifications}){
    return {
        notifications
    }
}
export default connect(mapStateToProps,actions)(Notification);
