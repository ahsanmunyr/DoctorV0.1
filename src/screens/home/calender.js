import React from 'react';
import {View,Text,StyleSheet} from "react-native";
import {Calendar} from 'react-native-calendars';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useTheme } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import { connect } from 'react-redux';
import * as actions from "../../store/action";
import { useState } from 'react';
function Calender1({searhByDay,navigation}){
    const {colors}=useTheme()
    const [seletedDate,setSeletedDate]=useState({})
    const getDay=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    return(
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'90%'}}>
            <CalendarStrip
            scrollable
            customDatesStyles={[seletedDate]}
            style={{paddingVertical:responsiveFontSize(2),borderRadius:responsiveFontSize(1),...styles.con}}
            calendarColor={'#fff'}
            calendarHeaderStyle={{color: colors.text}}
            onDateSelected={(date)=>{
                navigation.push("searchRecord",{day:getDay[new Date(date).getDay()],date:false})
            }}
            // iconLeft={()=><View/>}
            // iconRight={()=><View/>}
            highlightDateContainerStyle={{backgroundColor:colors.card}}
            highlightDateNameStyle={{color:'white'}}
            highlightDateNumberStyle={{color:'white'}}
            dateNumberStyle={{color: 'grey'}}
            dateNameStyle={{color: colors.card,marginTop:4}}
            iconContainer={{flex: 0.2}}
            daySelectionAnimation={{
                duration:500
            }}
            />
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    con:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    }

})


export default connect(null,actions)(Calender1)