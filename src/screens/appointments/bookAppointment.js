import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image,ScrollView} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize,
    responsiveHeight
  } from "react-native-responsive-dimensions";
  import {
    useToast
  } from "native-base"
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux";
import Btn from '../../components/btn';
import { CardField, useStripe ,StripeProvider} from '@stripe/stripe-react-native';
import SuccessModel from '../../components/succesModel';
import Calender from './calender';

function BookAppointMent ({navigation,route,getTime,times,clearTimes,bookAppointMent,user}){
    const {colors}=useTheme();
    const {createToken } = useStripe();
    const toast = useToast()
    const [loading,setLoading]=useState(true)
    const [loader,setLoader]=useState(false)
    const [submit,setSubmit]=useState(false)
    const [timeLoader,setTimeLoader]=useState(false)
    const [model,setModel]=useState(false)
    const [updatedTiming,setUpdatedTIming]=useState([])
    const [fields,setFields]=useState({

    })

    const getValue=(k,v)=>{
        setFields({...fields,[k]:v})
    }

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
        setFields(route.params.doctorDetail)
        setLoading(false)

        return ()=>{
            clearTimes()
        }
    },[])

    function onAppointment(){
        if(fields.data && fields.expireMonth && fields.lastNumber && fields.stripeToken && fields.givenTime){
            setLoader(true)
            bookAppointMent({
                ...fields.data,
                expireMonth:fields.expireMonth,
                stripeToken:fields.stripeToken,
                lastNumber:fields.lastNumber,
                time:fields.givenTime,
                amount:fields.fee,
                userId:user.user_id
            }).then((res)=>{
                setModel(true)
                setLoader(false)

            })
        }else{
            toast.show({
                title: "Please select All fields",
                placement:'top',
                bgColor:'#c82a2a'
              })
        }
    }

    function onchangeDate(data){
        setTimeLoader(true)
        getTime({...data,drId:fields.id}).then(()=>setTimeLoader(false))
        getValue('data',{...data,drId:fields.id})
    }
    const timeMemo=useMemo(()=>{
        if(times.length>0){
            const uT=times.map((item)=>{
                return{...item,edit:false}
            })
            setUpdatedTIming(uT)
        }
    },[times])
    function renderTimes(){
        return updatedTiming.map((item,i)=>{
            return(
                <TouchableOpacity 
                onPress={()=>{
                    const selectTime=[...updatedTiming.map(subItem=>{
                        if(subItem.time==item.time){
                            return {...subItem,edit:true}
                        }else{
                            return {...subItem,edit:false}
                        }
                    })]
                    setUpdatedTIming(selectTime)
                    setFields({...fields,givenTime:item.time})
                }}
                disabled={item.isBooked}
                key={i}
                style={{padding:responsiveFontSize(0.5),width:'22%',backgroundColor:item.isBooked?'#dedede':(item.edit?colors.text:'#c9edfd'),margin:responsiveFontSize(0.5),borderRadius:responsiveFontSize(2),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:responsiveFontSize(1.5),color:item.edit?'white':'black'}}>{item.time}</Text>
                </TouchableOpacity>
            )
        })
    }
    if(loading){
        return <Loader/>
    }else{
        return(
            <ScrollView style={{flex:1,paddingHorizontal:responsiveFontSize(2),paddingVertical:responsiveFontSize(3)}}>
                <SuccessModel
                closeModle={()=>{
                    setModel(false)
                    navigation.jumpTo('appointment')
                }}
                title={"Successfully Book Appoinment"}
                visible={model}
                />
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-start'}}>
                    <View style={{width:'37%'}}>
                        <View style={styles.img}>
                            <Image
                            style={{width:responsiveFontSize(16),height:responsiveFontSize(16),borderRadius:responsiveFontSize(2)}}
                            source={require("../../../assets/profile.png")}
                            />
                        </View>
                    </View>
                    <View style={{width:'63%',marginLeft:responsiveFontSize(1)}}>
                        <Text style={{color:colors.text,...styles.heading}}>
                            {fields.dr_name}
                        </Text>
                        <Text style={styles.sub}>
                            {"category_id"}
                        </Text>
                        <Text style={styles.sub}>
                            Fee: <Text style={{color:'green'}}>${fields.fee}</Text>
                        </Text>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:responsiveFontSize(1)}}>
                            <Text style={{fontSize:responsiveFontSize(1.25),justifyContent:'center'}}>
                            {fields.description.length>160?fields.description:fields.description.slice(0,160)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{marginBottom:responsiveFontSize(5)}}>
                    <View style={{marginVertical:responsiveFontSize(2)}}>
                        <Calender days={route.params.doctorDetail.timings} onchangeDate={onchangeDate}/>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:"wrap",justifyContent:'center',alignItems:'center'}}>
                        {timeLoader?(
                            <Loader/>
                        ):renderTimes()}
                    </View>
                    <StripeProvider publishableKey="pk_test_51IYkxoEDAWFaP2cd0ohJkxztAnrtUzwKX0c2Bh0Wfn9XZLliUJSguiJ60grzylUtg6V2ZXVRaHWT1shvpZBlXCoS001ZHNZcig">
                                <CardField
                                postalCodeEnabled={false}
                                placeholder={{
                                    number: '4242 4242 4242 4242',
                                }}
                                
                                cardStyle={{
                                    backgroundColor: '#FFFFFF',
                                    textColor: '#000000',
                                }}
                                style={{
                                    width: '100%',
                                    height: 50,
                                    marginVertical: responsiveFontSize(1),
                                }}
                                onCardChange={(cardDetails) => {
                                    if(cardDetails.complete){
                                        createToken(cardDetails).then(res=>{
                                            console.log(res)
                                            if(res.token){
                                                setFields({
                                                    ...fields,
                                                    stripeToken:res.token.id,
                                                    expireMonth:res.token.card.expMonth,
                                                    lastNumber:res.token.card.last4
                                                })
                                            }
                                            
                                        })
                                    }
                                    
                                }}

                                />
                        </StripeProvider>
                    <Btn
                    text="Book Appointment"
                    color="#fab701"
                    loader={loader}
                    call={onAppointment}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    heading:{
        fontSize:responsiveFontSize(2.75),
        fontFamily:'Montserrat-Bold',
    },
    sub:{
        color:'grey',
        fontSize:responsiveFontSize(1.5)
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

function mapStateToProps({doctorDetail,times,user}){
    return {
        doctorDetail,times,user
    }
}

export default connect(mapStateToProps,actions)(BookAppointMent);
