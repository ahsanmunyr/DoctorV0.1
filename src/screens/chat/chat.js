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
import {connect} from "react-redux";
import ContatList from "./contact"

function Chat ({navigation}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(false)


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
    

    if(loading){
        return <Loader/>
    }else{
        return(
            <View style={{flex:1}}>
                <ContatList/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    
})

function mapStateToProps({user}){
    return {
        user:1
    }
}

export default connect(mapStateToProps,actions)(Chat);
