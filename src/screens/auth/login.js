import React,{useEffect, useRef,useState} from 'react';
import { View ,Text,ImageBackground,ScrollView,StyleSheet,Dimensions,Image,TouchableOpacity, Animated} from 'react-native';
import InputField from '../../components/InputField';
import MailIcon from "react-native-vector-icons/Fontisto";
import PassIcon from "react-native-vector-icons/Feather";
import ValidateEmail from "../../utils/emailValidation"
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import * as actions from "../../store/action"
import Btn from "../../components/btn"
import { connect } from 'react-redux';
import {useTheme} from "@react-navigation/native"
const {height,width}=Dimensions.get('screen')

function Login({login,navigation,user,doctorLogin}){
    const {colors}=useTheme()
    const opacity=useRef(new Animated.Value(0)).current
    const [fields,setFields]=useState({
        email:"",
        password:""
    })
    const [submit,setSubmit]=useState();
    const [loader,setLoader]=useState(false)
    const [role,setRole]=useState("patient")

    useEffect(()=>{
        Animated.timing(opacity,{
            toValue:1,
            duration:700,
            useNativeDriver:true
        }).start()
    },[])

    function getValue(k,v){
        setFields((pS)=>{
            return{
                ...pS,
                [k]:v
            }
        })
    }

    function renderLoader(con){
        if(con){
            setLoader(true)
        }else{
            setLoader(false)
        }
    }

    function onLogin(){
        setSubmit(true)
        if(fields.password && fields.email){
            renderLoader(true)
            if(role=="doctor"){
                doctorLogin(fields).then(()=>renderLoader(false)).catch((err)=>{
                    renderLoader(false)
                    alert(err)
                })
            }else{
                login(fields).then(()=>renderLoader(false)).catch((err)=>{
                    renderLoader(false)
                    alert(err)
                })
            }
        }
    }

    return(
                <ImageBackground style={{flex:1}} source={require('../../../assets/background.png')}>
                    <Animated.ScrollView 
                    style={{flex:1,opacity }}>
                    <View style={styles.con}>
                            <View style={{...styles.heading,marginBottom:20}}>
                                <Image
                                style={{width:responsiveFontSize(15),height:responsiveFontSize(15)}}
                                source={require('../../../assets/logo.png')}
                                />
                            </View>
                        <View style={{...styles.child}}>
                            <View style={{...styles.heading,width:'100%'}}>
                                <Text style={{color:'white',textAlign:'center',width:'100%',fontSize:responsiveFontSize(4),fontWeight:'700',paddingVertical:responsiveFontSize(2),textTransform:'uppercase'}}>{role=="patient"?"Patient Panel":"Doctor Panel"}</Text>
                            </View>
                            <InputField
                                error={!fields.email &&  submit?true:null}
                                getValue={(v)=>getValue('email',v)}
                                icon={()=>{
                                    return(
                                        <MailIcon 
                                        name="email"
                                        color={"white"}
                                        size={20}
                                        />
                                    )
                                }}
                                password={false}
                                placeHolder="Email or User name"
                                color="white"
                                />
                            <InputField
                            error={!fields.password&& submit?true:null}
                            placeHolderColor="white"
                            getValue={(v)=>getValue('password',v)}
                            icon={()=>{
                                return(
                                    <PassIcon 
                                    name="lock"
                                    color={"white"}
                                    size={20}
                                    />
                                )
                            }}
                            password={true}
                            placeHolder="Password"
                            color="white"
                            />
                            <View>
                                {user.msg?<Text style={{fontSize:12,color:'red',width:'100%',textAlign:'center'}}>{user.msg}</Text>:null}
                            </View>
                            <View style={{marginTop:responsiveFontSize(5)}}>
                            <Btn
                            text="Sign In"
                            loader={loader}
                            color="white"
                            loaderColor="#0d3b80"
                            textColor="#0d3b80"
                            call={onLogin}
                            />
                            </View>
                        </View>
                        <View style={{width:'80%',justifyContent:'center',alignItems:'center'}}>
                            {
                                role=="patient"?(
                                    <>
                                    <TouchableOpacity 
                                    onPress={()=>navigation.push('forgetPassword')}
                                    style={{width:'100%',justifyContent:'center',alignItems:'center'}}
                                    >
                                        <Text style={{fontSize:12,color:'white',marginVertical:responsiveFontSize(3)}}>Forget Password</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    onPress={()=>navigation.push('signUp')}
                                    style={{width:'100%',justifyContent:'center',alignItems:'center'}}
                                    >
                                        <Text style={{fontSize:responsiveFontSize(2.5),textDecorationLine:'underline',color:'white',marginVertical:4}}>Sign Up</Text>
                                    </TouchableOpacity>
                                    </>
                                ):null
                            }
                        </View>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity
                        style={{marginTop:responsiveFontSize(2)}}
                        onPress={()=>setRole(role=="patient"?"doctor":"patient")}
                        >
                            <Text style={{color:'white',textDecorationLine:'underline'}}>Click here for {role=="patient"?"Doctor":"Patient" } Panel</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
                </ImageBackground>
    )
}


const styles=StyleSheet.create({
    con:{
        marginTop:responsiveFontSize(7),
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    child:{
        width:'85%',
    },
    heading:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center'
    }
})

function mapStateToProps({user}){
    return {user}
}

export default connect(mapStateToProps,actions)(Login);
