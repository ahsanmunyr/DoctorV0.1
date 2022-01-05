import React, { useEffect, useState,useLayoutEffect, useMemo } from 'react';
import { View ,Text,TouchableOpacity,FlatList,StyleSheet,Image, ScrollView, ImageBackground} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize,
    responsiveHeight
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import {connect} from "react-redux"
import SearchBar from '../../components/searchBar';
import LinearGradient from 'react-native-linear-gradient'
import Calender from './calender';
import DoctorIcon from "react-native-vector-icons/Fontisto"
import {imgBaseUrl} from "../../config/config.json"
import FilterIcon from "react-native-vector-icons/Ionicons";

const localImage="https://webprojectmockup.com:9449/dataServices/public/uploads/default_user_image_123.jpeg"

function Home ({navigation,getCategories,categories,getTopDoctors,topDoctors}){
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
      Promise.all([getTopDoctors(),getCategories()]).then(()=>{
        setLoading(false)
      })
      navigation.addListener('focus',()=>{
        getTopDoctors()
      })
    },[])

    function renderCategory({item}){
        return (
            <TouchableOpacity 
            onPress={()=>navigation.push("searchRecord",{text:item.name})}
            style={{backgroundColor:colors.card,...styles.catCon}}>
                <DoctorIcon
                name="doctor"
                color={"white"}
                size={responsiveFontSize(3)}
                />
               <Text style={{fontSize:responsiveFontSize(1.5),color:'white',marginTop:responsiveFontSize(0.2)}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    function renderDoctor({item}){
        return(
            <TouchableOpacity 
            onPress={()=>navigation.push('doctorDetail',{id:item.id})}
            style={{...styles.doc}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                <Image
                    style={{width:responsiveFontSize(6),height:responsiveFontSize(8),borderRadius:responsiveFontSize(1)}}
                    source={{uri:item.user_image?imgBaseUrl+item.user_image:localImage}}
                    />
                    <View style={{paddingLeft:responsiveFontSize(1)}}>
                    <Text style={{width:'90%',color:colors.text,fontSize:responsiveFontSize(1.5)}}>{item.dr_name}</Text>
                    <Text style={{width:'90%',fontSize:responsiveFontSize(1.25),color:'grey',marginVertical:responsiveFontSize(0.5)}}>Price: <Text style={{color:'green'}}>${item.fee}</Text></Text>
                    <Text style={{width:'90%',fontSize:responsiveFontSize(1.25),color:colors.card}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if(loading){
        return <Loader/>
    }else{
        return(
            <ScrollView style={{flex:1}}>
                <View style={{flex:1}}>
                    <Text style={{color:colors.text,...styles.heading}}>
                        Let’s Find Your {"\n"}
                        Doctor
                    </Text>
                    <View style={{alignItems:'center'}}>
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={(item,i)=>i.toString()}
                        />
                    </View>
                    <View style={{marginVertical:responsiveFontSize(1)}}>
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
                    </View>
                    <View style={{marginVertical:responsiveFontSize(2)}}>
                        <Calender
                        navigation={navigation}
                        />
                    </View>
                    <View style={{marginVertical:responsiveFontSize(2),marginLeft:responsiveFontSize(2)}}>
                            <ImageBackground
                            source={require('../../../assets/categoriesIcon/gridiant.png')}
                            style={{width:'100%',height:responsiveHeight(25),justifyContent:'center',alignItems:'center'}}
                            >
                                {/* <Text style={{backgroundColor:'green',width:100,transform:[{rotate:'90deg'}]}}>Top Doctors</Text> */}
                                <View style={{paddingLeft:responsiveWidth(15)}}>
                                    <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{alignItems:'center'}}
                                    horizontal={true}
                                    data={topDoctors}
                                    renderItem={renderDoctor}
                                    keyExtractor={(item,i)=>i.toString()}
                                    />
                                </View>
                            </ImageBackground>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    heading:{
        fontSize:responsiveFontSize(3.5),
        fontFamily:'Montserrat-Bold',
        padding:responsiveFontSize(2)
    },
    catCon:{
        width:responsiveFontSize(15),
        height:responsiveFontSize(8),
        paddingHorizontal:responsiveFontSize(0.5),
        margin:responsiveFontSize(1),
        borderRadius:responsiveFontSize(1),
        justifyContent:'center',
        alignItems:'center'
    },
    doc:{
        backgroundColor:'white',
        height:responsiveHeight(17),
        width:responsiveWidth(40),
        margin:responsiveFontSize(0.8),
        borderRadius:responsiveFontSize(1.5),
        justifyContent:'center',
        padding:responsiveFontSize(2),
        alignItems:'center'
    }
})

function mapStateToProps({categories,topDoctors}){
    return {
        categories,
        topDoctors
    }
}

export default connect(mapStateToProps,actions)(Home);
