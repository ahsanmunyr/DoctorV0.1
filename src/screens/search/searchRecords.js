import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux"
import DoctorComponent from '../../components/doctor';
import route from '../../route';
import {imgBaseUrl} from "../../config/config.json"

const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"

function SearchRecord ({navigation,searchDoctor,searchDoctorData,route,searhByDay}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:'white',fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>,
            headerRight: () => (
                <TouchableOpacity 
                onPress={()=>navigation.jumpTo('profile')}
                style={{paddingRight:responsiveWidth(5)}}>
                    <ProfileIcon name="user-circle" size={22} color={'white'}/>
                </TouchableOpacity>
            )
            
          });
    },[navigation])
    
    useEffect(()=>{
        if(route.params.day){
            searhByDay(route.params.day).then(()=>{
                setLoading(false)
            })
        }else{
            searchDoctor(route.params.text).then(()=>{
                setLoading(false)
            })
        }
    },[])

    function renderDoctor({item}){
        console.log(item)
        return(
            <DoctorComponent
            cat={item.category_name}
            name={item.dr_name}
            price={item.fee}
            call={()=>navigation.push('doctorDetail',{id:item.id})}
            img={{uri:item.user_image?imgBaseUrl+item.user_image:localImage}}
            />
        )
    }

    if(loading){
        return <Loader/>
    }else{
        return(
            <View style={{flex:1}}>
                    {searchDoctorData.length>0?(
                        <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{width:'100%'}}
                        data={searchDoctorData}
                        renderItem={renderDoctor}
                        keyExtractor={(item,i)=>i.toString()}
                        />
                    ):(
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:responsiveFontSize(3),fontWeight:'700'}}>Not Found</Text>
                        </View>
                    )}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    catCon:{
        width:responsiveWidth(42),
        height:responsiveWidth(42),
        margin:responsiveFontSize(1),
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center'
    },
})

function mapStateToProps({searchDoctorData}){
    return {
        searchDoctorData
    }
}

export default connect(mapStateToProps,actions)(SearchRecord);
