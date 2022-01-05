import React,{useState,useEffect,useRef,useMemo} from 'react';
import { View ,Text,TouchableOpacity,ScrollView,StyleSheet,Dimensions,Image,ImageBackground} from 'react-native';
import InputField from '../../components/InputField';
import MailIcon from "react-native-vector-icons/Fontisto";
import PassIcon from "react-native-vector-icons/Feather";
import UserIcon from "react-native-vector-icons/AntDesign";
import LocationIcon from "react-native-vector-icons/Entypo";
import BackIcon from "react-native-vector-icons/Ionicons";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import * as actions from "../../store/action"
import Btn from "../../components/btn"
import { connect } from 'react-redux';
import ErrorModel from '../../components/errorModel';
import { useTheme } from '@react-navigation/native';

const {height,width}=Dimensions.get('screen')

function SignUp({registration,navigation,user}){
    const {colors}=useTheme()
    const [fields,setFields]=useState({
        email:"",
        password:"",
        confirmPassword:"",
        firstName:"",
        lastName:"",
        mobileNo:"",
        address:""
    })
    
    const [submit,setSubmit]=useState();
    const [loader,setLoader]=useState(false)
    const [errorModel,setErrorModel]=useState(false)
    const ErrorMemo=useMemo(()=>{
        console.log("cal")
        user.success==false?setErrorModel(true):setErrorModel(false)
    },[user])
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

    function onRegisteration(){
        setSubmit(true)
        if(fields.password==fields.confirmPassword&&fields.password && fields.email && fields.firstName && fields.lastName && fields.mobileNo && fields.address){
            renderLoader(true)
            registration(fields).then(()=>renderLoader(false)).catch((err)=>{
                renderLoader(false)
                alert(err)
            })
        }
    }

    return(

        <ImageBackground style={{flex:1}} source={require('../../../assets/background.png')}>
                    {errorModel?(
                        <ErrorModel
                        visible={errorModel}
                        title={user.message}
                        closeModle={()=>setErrorModel(false)}
                        />
                    ):null}
                    <ScrollView 
                    style={{flex:1}}>
                    <View style={styles.con}>
                    <TouchableOpacity 
                        onPress={()=>navigation.goBack()}
                        style={{width:'100%',paddingTop:10,paddingLeft:15}}
                        >
                            <BackIcon
                            name="arrow-back"
                            color="white"
                            size={30}
                            />
                        </TouchableOpacity>
                            <View style={{...styles.heading,marginBottom:20}}>
                                <Image
                                style={{width:responsiveFontSize(10),height:responsiveFontSize(10)}}
                                source={require('../../../assets/logo.png')}
                                />
                            </View>
                        <View style={{...styles.child}}>
                            <View style={{...styles.heading,width:'100%'}}>
                                <Text style={{color:'white',textAlign:'center',width:'100%',fontSize:responsiveFontSize(5),fontWeight:'700',paddingBottom:responsiveFontSize(2)}}>Sign In</Text>
                            </View>
                            <InputField
                                    error={!fields.firstName&& submit?true:null}
                                    getValue={(v)=>getValue('firstName',v)}
                                    icon={()=>{
                                        return(
                                            <UserIcon 
                                            name="user"
                                            color={"white"}
                                            size={20}
                                            />
                                        )
                                    }}
                                    password={false}
                                    placeHolder="First Name"
                                    color="white"
                                    />
                                    <InputField
                                    error={!fields.lastName&& submit?true:null}
                                    getValue={(v)=>getValue('lastName',v)}
                                    icon={()=>{
                                        return(
                                            <UserIcon 
                                            name="user"
                                            color={"white"}
                                            size={20}
                                            />
                                        )
                                    }}
                                    password={false}
                                    placeHolder="Last Name"
                                    color="white"
                                    />
                                    <InputField
                                    error={!fields.email&& submit?true:null}
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
                                    placeHolder="Email"
                                    color="white"
                                    />
                                    <InputField
                                    error={!fields.mobileNo&& submit?true:null}
                                    getValue={(v)=>getValue('mobileNo',v)}
                                    icon={()=>{
                                        return(
                                            <MailIcon 
                                            name="mobile-alt"
                                            color={"white"}
                                            size={20}
                                            />
                                        )
                                    }}
                                    password={false}
                                    keyboardType="number"
                                    placeHolder="Mobile No"
                                    color="white"
                                    />
                                <InputField
                                    error={!fields.address&& submit?true:null}
                                    getValue={(v)=>getValue('address',v)}
                                    icon={()=>{
                                        return(
                                            <LocationIcon 
                                            name="location"
                                            color={"white"}
                                            size={20}
                                            />
                                        )
                                    }}
                                    password={false}
                                    keyboardType="number"
                                    placeHolder="Address"
                                    color="white"
                                    />
                                <InputField
                                error={!fields.password&& submit?true:null}
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
                                <InputField
                                error={!fields.confirmPassword&& submit?true:null}
                                getValue={(v)=>getValue('confirmPassword',v)}
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
                                placeHolder="Confirm Password"
                                color="white"
                                />
                                <View>
                                    {
                                        fields.password==fields.confirmPassword?null:(
                                            <Text style={{fontSize:12,color:'red',width:'100%',textAlign:'center'}}>Password not match</Text>
                                        )
                                    }
                                </View>
                            <View>
                                {user.msg?<Text style={{fontSize:12,color:'red',width:'100%',textAlign:'center'}}>{user.msg}</Text>:null}
                            </View>
                            <View style={{marginTop:responsiveFontSize(5)}}>
                            <Btn
                            text="Sign Up"
                            loader={loader}
                            loaderColor="#0d3b80"
                            color="white"
                            textColor="#0d3b80"
                            call={onRegisteration}
                            />
                            </View>
                        </View>
                        <View style={{width:'80%',justifyContent:'center',alignItems:'center',flexDirection:'row',marginBottom:responsiveFontSize(3),marginTop:responsiveFontSize(1)}}>
                                <Text style={{fontSize:12,color:'white'}}>Already a member? </Text>
                                <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={{color:'white',fontSize:12,textDecorationLine:'underline',marginLeft:responsiveWidth(0.5)}}>SignUp</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                </ImageBackground>
    )
}


const styles=StyleSheet.create({
    con:{
        flex:1,
        width:'100%',
        alignItems:'center'
    },
    child:{
        width:'100%',
        flex:1,
        paddingHorizontal:responsiveFontSize(3),
    },
    heading:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center'
    }
})

function mapStateToProps({user}){
    return{user}
}

export default connect(mapStateToProps,actions)(SignUp);