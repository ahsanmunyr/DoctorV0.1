import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {useTheme} from "@react-navigation/native"
function Loader({color}){
    const {colors}=useTheme()
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator
            size={30}
            color={color?color:colors.card}
            />
        </View>
    )
}

export default Loader;
