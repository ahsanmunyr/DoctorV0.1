import React,{useState,useEffect,useRef} from 'react';
import { View ,Text,TouchableOpacity,StyleSheet,Dimensions,Image,ImageBackground} from 'react-native';
import InputField from '../../components/InputField';
import MailIcon from "react-native-vector-icons/Fontisto";
import BackIcon from "react-native-vector-icons/Ionicons";
import ResetPasswordIcon from "react-native-vector-icons/MaterialCommunityIcons"
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import * as actions from "../../store/action"
import Btn from "../../components/btn"
import { connect } from 'react-redux';
import {useTheme} from "@react-navigation/native";
import SuccessModel from '../../components/succesModel';

const {height,width}=Dimensions.get('screen')

function ForgetPassword({navigation,forgetPassword}){
    const {colors}=useTheme()
    const [fields,setFields]=useState({
        email:""
    })
    
    const [submit,setSubmit]=useState();
    const [loader,setLoader]=useState(false)
    const [model,setModel]=useState(false)
    const [data,setData]=useState({})
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

    function onForgetPassword(){
        setSubmit(true)
        if(fields.email){
            renderLoader(true)
            forgetPassword(fields.email).then((res)=>{
                renderLoader(false)
                res.status?setModel(true):null
                setData(res)
            }).catch((err)=>{
                renderLoader(false)
                alert(err)
            })
        }
    }

    return(
                <ImageBackground 
                source={require('../../../assets/background.png')}
                style={{flex:1}}>
                    {data.status?(
                        <SuccessModel
                        title={data.msg}
                        visible={model}
                        closeModle={()=>setModel(false)}
                        />
                    ):null}
                    <View 
                    style={styles.con}>
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
                                resizeMode="contain"
                                style={{width:responsiveFontSize(13),height:responsiveFontSize(12)}}
                                source={require('../../../assets/logo.png')}
                                />
                                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>
                                    Forget Password
                                </Text>
                            </View>
                        <View style={{...styles.child}}>
                            <View style={{width:'100%',justifyContent:'center',alignItems:'center',marginVertical:5}}>
                                <ResetPasswordIcon
                                name="lock-reset"
                                color={"white"}
                                size={responsiveFontSize(10)}
                                />
                            </View>
                            <Text style={{width:'100%',textAlign:'center',fontSize:responsiveFontSize(2),color:'white',marginVertical:responsiveFontSize(1)}}>
                                Please enter your email address, {'\n'}
                                we will send you a link to reset password
                            </Text>
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
                                {data.status==0?(
                                    <View>
                                    <Text style={{fontSize:12,color:'red',width:'100%',textAlign:'center'}}>{data.msg}</Text>
                                </View>
                                ):null}
                                <View style={{marginVertical:responsiveFontSize(1)}}>
                                <Btn
                                text="Reset Password"
                                loader={loader}
                                loaderColor="#0d3b80"
                                color="white"
                                textColor="#0d3b80"
                                call={onForgetPassword}
                                />
                                </View>
                        </View>
                    </View>
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
        padding:responsiveFontSize(3),
    },
    heading:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center'
    }
})

export default connect(null,actions)(ForgetPassword);
