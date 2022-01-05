import React from 'react';
import {View,Text,StyleSheet} from "react-native";
import {Calendar} from 'react-native-calendars';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useTheme } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import formatDate from '../../utils/formatDate';
import { useState } from 'react';
function Calender1({days,onchangeDate}){
    const {colors}=useTheme()
    const [seletedDate,setSeletedDate]=useState({})
    const no=[1,2,3,4,5,6,7]
    const arr=[]
    const getDay=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      const daysInNo=days.map((item)=>{
        switch(item.day){
            case "Monday":
                return 1;
            case "Tuesday":
                return 2;
            case "Wednesday":
                return 3;
            case "Thursday":
                return 4;
            case "Friday":
                return 5;
            case "Saturday":
                return 6;
            case "Sunday":
                return 7;
        }
    })

    no.forEach((n,i)=>{
        if(daysInNo.indexOf(n)!=-1){
            arr.push(false)
        }else{
            arr.push(n)
        }
    })
    const datesBlacklistFunc = date => {
        if(arr[0]==1){
            if(date.isoWeekday() === 1){
                return date.isoWeekday() === 1
            }
        }
        if(arr[1]==2){
            if(date.isoWeekday() === 2){
                return date.isoWeekday() === 2
            }
        }
        if(arr[2]==3){
            if(date.isoWeekday() === 3){
                return date.isoWeekday() === 3
            }
        }
        if(arr[3]==4){
            if(date.isoWeekday() === 4){
                return date.isoWeekday() === 4
            }
        }
        if(arr[4]==5){
            if(date.isoWeekday() === 5){
                return date.isoWeekday() === 5
            }
        }
        if(arr[5]==6){
            if(date.isoWeekday() === 6){
                return date.isoWeekday() === 6
            }
        }
        if(arr[6]==7){
            if(date.isoWeekday() === 7){
                return date.isoWeekday() === 7
            }
        }

      }
    return(
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'100%'}}>
            <CalendarStrip
            scrollable
            startingDate={new Date()}
            customDatesStyles={[seletedDate]}
            style={{paddingVertical:responsiveFontSize(2),borderRadius:responsiveFontSize(1),...styles.con}}
            calendarColor={'#fff'}
            calendarHeaderStyle={{color: colors.text}}
            onDateSelected={(date)=>{
                const day=new Date(date).getDay()
                onchangeDate({
                    appointmentDate:formatDate(new Date(date)),
                    day:getDay[day]
                })
            }}
            // iconLeft={()=><View/>}
            // iconRight={()=><View/>}
            datesBlacklist={datesBlacklistFunc}
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
        height:90
    }

})


export default Calender1