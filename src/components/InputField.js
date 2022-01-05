import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from 'react-native';
import ErrorIcon from "react-native-vector-icons/MaterialIcons"
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import {useTheme} from "@react-navigation/native"

function InputField ({placeHolder,icon,getValue,password,keyboardType,defaultValue,color,error,disable}){
    const {colors}=useTheme();
    return (
        <View style={styles.con}>
            <View style={{position:'absolute',left:1,marginLeft:responsiveFontSize(1.5)}}>
                {icon()}
            </View>
            <TextInput
            editable={disable?false:true}
            defaultValue={defaultValue?defaultValue:null}
            value={defaultValue?defaultValue:null}
            keyboardType={keyboardType==="number"?'number-pad':'default'}
            secureTextEntry={password?true:false}
            onChangeText={(v)=>getValue(v)}
            placeholder={placeHolder}
            placeholderTextColor={color}
            style={{...styles.input,color:color,borderColor:color=="grey"?colors.card:'white'}}
            />
            {error?(
                <View style={{position:'absolute',right:1,marginRight:responsiveFontSize(1.5)}}>
                    <ErrorIcon
                    name="error"
                    color="#f01100"
                    size={18}
                    />
                </View>
            ):null}
        </View>

      );
}

const styles=StyleSheet.create({
input:{
    borderWidth:1,
    flex: 1,
    paddingTop: responsiveHeight(1),
    borderRadius:responsiveFontSize(1),
    paddingRight: 10,
    paddingBottom:responsiveFontSize(1),
    paddingLeft: responsiveWidth(12),

},
con: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:responsiveFontSize(1)
},
})

export default InputField