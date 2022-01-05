import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import {useTheme} from "@react-navigation/native"

function Btn ({text,call,color,loader,textColor,loaderColor}){
    const {colors}=useTheme()
    return (
        <TouchableOpacity 
        onPress={call}
        style={{...styles.blueBtn,backgroundColor:color?color:colors.card}}>
        {loader?(
            <ActivityIndicator size={responsiveFontSize(3)} color={loaderColor?loaderColor:"white"}/>
        ):(
            <Text style={{color:textColor?textColor:'white',fontSize:responsiveFontSize(2)}}>{text.toUpperCase()}</Text>
        )}
        </TouchableOpacity>
      );
}

const styles=StyleSheet.create({
    blueBtn:{
        width:'100%',
        borderRadius:responsiveFontSize(1),
        height:responsiveHeight(6),
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Btn