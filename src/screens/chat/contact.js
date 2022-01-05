import { View,Text, StyleSheet,Image, TouchableOpacity } from "react-native";
import React,{useState,useEffect} from "react";
import * as actions from "../../store/action"
import {connect} from "react-redux"
import { FlatList } from "native-base";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation, useTheme } from "@react-navigation/native";
import database from "@react-native-firebase/database"
import {imgBaseUrl} from "../../config/config.json"


function ContactList({getChatUsers,conversationUser,user}){
    const {colors}=useTheme()
    const navigation=useNavigation()
    const [onlineUsers,setOnlineUsers]=useState([])

    useEffect(()=>{
            const sub=[
                navigation.addListener('focus',()=>{
                    if(true){
                        database().ref('/onlineUsers').on('value',snap=>{
                            if(snap.val()!=null){
                                const values=Object.values(snap.val())
                                setOnlineUsers(values)
                            }
                        })
                    }
                }),
                navigation.addListener('blur',()=>{
                    database().ref('/onlineUsers').off()
                })
            ]

            return function cleanup() {
                sub.forEach((unSub) => {
                  unSub()
                })
              }
    },[user,navigation])
    
    function showOnlineTick(item){
        const name=user.role=="Dr"?user.first_name:`${user.first_name} ${user.last_name}`
        var status=false
        onlineUsers
        .filter((item)=>item!=null)
        .filter((item)=>item.id!==name)
        .map(u=>{
            if(item.id==u.id && item.name==u.name){
                status=true
            }
        })
        return status
    }

    function renderUser({item}){
        const date=item.message.createdAt.toDate()
        const slashIndex=item.url.lastIndexOf('/')
        const onlyPicName=item.url.slice(slashIndex+1,item.url.length)
        return(
            <TouchableOpacity 
            onPress={()=>{
                navigation.push('chatBoard',{
                    sId:user.user_id.toString(),
                    rId:item.id.toString(),
                    role:user.role=="Dr"?"Dr":"Pr",
                    sName:user.role=="Dr"?user.first_name:(user.first_name+" "+user.last_name),
                    sImage:user.user_image?imgBaseUrl+user.user_image:"https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com%20C/O%20https://placeholder.com/",
                    rec:{
                        name:item.name,
                        mobile_token:item.mobile_token,
                        image:item.url
                    }
                })
            }}
            style={styles.userCon}>
                <View style={{width:'20%',justifyContent:'center',alignItems:'center'}}>
                    <Image
                    style={{
                        width:responsiveFontSize(7),
                        height:responsiveFontSize(7),
                        borderRadius:responsiveFontSize(7)/2,
                    }}
                    source={{uri:item.url}}
                    />
                    <View style={{backgroundColor:showOnlineTick(item)?'#6fe317':'orange',height:15,width:15,borderRadius:15/2,position:'absolute',right:responsiveFontSize(1),top:responsiveFontSize(5.5)}}/>
                </View>
                <View style={{width:'70%',justifyContent:'center',paddingLeft:responsiveFontSize(1)}}>
                    <Text style={{color:colors.text}}>{item.name}</Text>
                    <Text style={{color:'grey',fontSize:responsiveFontSize(1.5),marginTop:responsiveFontSize(0.5)}}>{item.message.text}</Text>
                </View>
                <View style={{width:'10%',justifyContent:'center',alignItems:'center'}}>
                {item.count?(
                    <View style={{height:20,width:20,borderRadius:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.text}}>
                        <Text style={{color:'white',fontSize:responsiveFontSize(1.2),fontFamily:'Montserrat-Medium'}}>{item.count}</Text>
                    </View>):null}
                </View>
            </TouchableOpacity>
        )
    }
    return(
        <View style={{flex:1}}>
            {conversationUser.length>0?(
                <View style={{width:'95%',alignSelf:'center',marginTop:responsiveFontSize(2)}}>
                    <FlatList
                    renderItem={renderUser}
                    data={conversationUser.sort((a,b)=>b.message.createdAt-a.message.createdAt)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item,i)=>i.toString()}
                    />
                </View>
            ):(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700'}}>Not Found</Text>
                </View>
            )}
        </View>
    )
}

const styles=StyleSheet.create({
    userCon:{
        backgroundColor:'white',
        borderRadius:responsiveFontSize(1),
        marginVertical:responsiveFontSize(0.5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        padding:responsiveFontSize(1),
        paddingVertical:responsiveFontSize(2),
        flexDirection:'row'
    }
})

function mapStateToProps({user,conversationUser}){
    return {user,conversationUser}
}

export default connect(mapStateToProps,actions)(ContactList);