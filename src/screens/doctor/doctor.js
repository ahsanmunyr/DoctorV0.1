import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image,ScrollView} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux";
import SearchBar from "../../components/searchBar";
import FilterIcon from "react-native-vector-icons/Ionicons";
import DoctorComponent from '../../components/doctor';
import {imgBaseUrl} from "../../config/config.json"

const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"

function Doctor ({navigation,getDoctors,doctors}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)


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
    
    useEffect(()=>{
        getDoctors().then(()=>{
            setLoading(false)
        })
    },[])

    function renderDoctor({item}){
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
                <Text style={{color:colors.text,...styles.heading}}>
                    Find a Best Doctor {"\n"}
                    For yourself
                </Text>
                <View style={{marginVertical:responsiveFontSize(2),width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:'85%'}}>
                        <SearchBar/>
                    </View>
                    <View style={{width:'15%',justifyContent:'center',alignItems:'flex-start'}}>
                       <TouchableOpacity
                       onPress={()=>navigation.push('search')}
                       style={{width:responsiveFontSize(5.5),height:responsiveFontSize(5.5),backgroundColor:colors.card,borderRadius:responsiveFontSize(5.5)/2,justifyContent:'center',alignItems:'center'}}
                       >
                           <FilterIcon
                           name="funnel-sharp"
                           size={responsiveFontSize(2)}
                           color="white"
                           />
                       </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{width:'100%',flex:1}}
                    data={doctors}
                    renderItem={renderDoctor}
                    keyExtractor={(item,i)=>i.toString()}
                    />
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    heading:{
        fontSize:responsiveFontSize(3.5),
        fontFamily:'Montserrat-Bold',
        padding:responsiveFontSize(2)
    },
    doc:{
        padding:responsiveFontSize(2),
        backgroundColor:'white',
        borderRadius:responsiveFontSize(4),
        marginVertical:responsiveFontSize(1),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        marginLeft:'auto',
        marginRight:'auto',
        elevation: 10,
    }
})

function mapStateToProps({doctors}){
    return {
        doctors
    }
}

export default connect(mapStateToProps,actions)(Doctor);
