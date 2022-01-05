import React, { useEffect, useState,useLayoutEffect } from 'react';
import { Text,TouchableOpacity,StyleSheet,useWindowDimensions} from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import ProfileIcon from "react-native-vector-icons/FontAwesome5";
import Loader from '../../components/pageLoader';
import {useTheme} from "@react-navigation/native";
import * as actions from "../../store/action";
import { TabView, TabBar,SceneMap } from 'react-native-tab-view';
import {connect} from "react-redux"
import Active from './active';
import Deactive from './deactive';
import { View } from 'native-base';

function AppointMent ({navigation,getDoctorAppointment,user,doctorAppointment}){
    const {colors}=useTheme();
    const [loading,setLoading]=useState(true)
    const [status,setStatus]=useState("active")
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Appointments' },
        { key: 'second', title: 'History' },
    ]);

    const renderScene = SceneMap({
        first:()=><Active navigation={navigation} data={doctorAppointment[0].activeData.reverse()}/>,
        second:()=><Deactive navigation={navigation} data={doctorAppointment[1].deactiveData.reverse()}/>,
    });

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
        getDoctorAppointment(user.user_id).then(()=>{
            setLoading(false)
        })
        navigation.addListener('focus',()=>{
            getDoctorAppointment(user.user_id)
        })
    },[])

    if(loading){
        return <Loader/>
    }else{
        if(doctorAppointment.length>0){
            const renderTabBar = props => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor:colors.card}}
                  activeColor={colors.card}
                  inactiveColor ={"grey"}
                  style={{ backgroundColor:"#f5f5f5"}}
                />
              );
              
            return(
            //     <TabView
            //     renderTabBar={renderTabBar}
            //     navigationState={{ index, routes }}
            //     renderScene={renderScene}
            //     onIndexChange={setIndex}
            //     initialLayout={{ width: layout.width }}
            //   />
            <View style={{flex:1}}>
            <View style={{paddingTop:responsiveFontSize(4),paddingBottom:responsiveFontSize(2),flexDirection:'row',justifyContent:'space-around'}}>
                <TouchableOpacity 
                onPress={()=>setStatus("active")}
                style={{backgroundColor:status=="active"?"#fab701":"#dbdbdb",height:responsiveFontSize(4),width:responsiveFontSize(18),borderRadius:responsiveFontSize(1),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:status=="active"?"white":"black"}}>Appoinments</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>setStatus("inactive")}
                style={{backgroundColor:status=="inactive"?"#fab701":"#dbdbdb",height:responsiveFontSize(4),width:responsiveFontSize(18),borderRadius:responsiveFontSize(1),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:status=="inactive"?"white":"black"}}>History</Text>
                </TouchableOpacity>
            </View>
            {
                status=="active"?(
                    <Active navigation={navigation} data={doctorAppointment[0].activeData.reverse()}/>
                ):(
                    <Deactive navigation={navigation} data={doctorAppointment[1].deactiveData.reverse()}/>
                )
            }
        </View>
            )
        }else{
            return(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:responsiveFontSize(4),fontWeight:"700"}}>Not Found</Text>
                </View>
            )
        }
        
    }
}

const styles=StyleSheet.create({
    
})

function mapStateToProps({user,doctorAppointment}){
    return {
        user,
        doctorAppointment
    }
}

export default connect(mapStateToProps,actions)(AppointMent);
