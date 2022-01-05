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
import SearchBar from '../../components/searchBar';
import DoctorIcon from "react-native-vector-icons/Fontisto"

function Search ({navigation,categories}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: props => <Text style={{textAlign:'center',color:'white',fontSize:responsiveFontSize(2.5),textTransform:'uppercase',fontFamily:'Montserrat-Bold'}}>{props.children}</Text>,
            headerRight: () => (
                <TouchableOpacity 
                onPress={()=>navigation.jumpTo('profile')}
                style={{paddingRight:responsiveWidth(5)}}>
                    <ProfileIcon name="user-circle" size={22} color='white'/>
                </TouchableOpacity>
            )
            
          });
    },[navigation])
    
    useEffect(()=>{
      setLoading(false)
        
    },[])
    function renderCategory({item}){
        return (
            <TouchableOpacity 
            onPress={()=>navigation.push("searchRecord",{text:item.name})}
            style={{backgroundColor:colors.card,...styles.catCon}}>
                <DoctorIcon
                name="doctor"
                color={"white"}
                size={responsiveFontSize(7)}
                />
               <Text style={{fontSize:responsiveFontSize(2),color:'white',marginTop:responsiveFontSize(2)}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    if(loading){
        return <Loader/>
    }else{
        return(
            <View style={{flex:1}}>
                <View style={{marginVertical:responsiveFontSize(2)}}>
                    <SearchBar/>
                </View>
                <View style={{alignItems:'center',flex:1}}>
                        <FlatList
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={(item,i)=>i.toString()}
                        />
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    catCon:{
        width:responsiveWidth(42),
        height:responsiveWidth(42),
        margin:responsiveFontSize(1),
        borderRadius:responsiveFontSize(1),
        justifyContent:'center',
        alignItems:'center'
    },
})

function mapStateToProps({categories}){
    return {
        categories
    }
}

export default connect(mapStateToProps,actions)(Search);
