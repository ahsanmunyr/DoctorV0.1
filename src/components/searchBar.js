import React, { useState } from 'react';
import { View ,TextInput,TouchableOpacity,StyleSheet} from 'react-native';
import SearchIcon from "react-native-vector-icons/FontAwesome"
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import {useTheme} from "@react-navigation/native";
import {useNavigation} from "@react-navigation/native";
import * as actions from "../store/action"
import { connect } from 'react-redux';
import { borderWidth } from 'styled-system';

function SearchBar(){
    const {colors}=useTheme();
    const navigation=useNavigation()
    const [searchText,setSearctText]=useState("")
    const [submit,setSubmit]=useState(false)
    function onSearch(){
        setSubmit(true)
        if(searchText){
            navigation.push("searchRecord",{text:searchText})
        }
    }
    return(
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                <View
                style={{
                    backgroundColor:"white",
                    borderWidth:!searchText && submit?0.5:0,
                    borderColor:'red'
                    ,...styles.con}}>
                <TextInput
                placeholder="Search Now"
                placeholderTextColor="#b8b8b8"
                 onChangeText={(v)=>setSearctText(v)}
                 style={{flexDirection:'row',flex:1,paddingVertical:0,paddingLeft:responsiveFontSize(2),fontSize:responsiveFontSize(1.5)}}
                 />
                <TouchableOpacity 
                onPress={onSearch}
                style={{
                    height:responsiveHeight(3),
                    width:responsiveHeight(3),
                    borderRadius:responsiveHeight(3)/2,
                    marginRight:responsiveFontSize(1.5),
                    ...styles.search,
                    justifyContent:'center',
                    alignItems:'center'}}>
                    <SearchIcon
                    name="search"
                    size={responsiveFontSize(1.5)}
                    color={colors.card}
                    />
                 </TouchableOpacity>
                </View>
             </View>
    )
}

const styles=StyleSheet.create({
    con:{
        justifyContent:'center',
        borderRadius:responsiveFontSize(1),
        alignItems:'center',
        flexDirection:'row',
        height:responsiveHeight(6),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        width:'90%'
    },
    search:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        backgroundColor:'white',
        elevation: 7,
    }
})

export default connect(null, actions)(SearchBar);
