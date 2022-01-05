import React, { useEffect, useState } from "react";
import {View,Text, Image, ImageBackground, TouchableOpacity, StyleSheet} from "react-native"
import CallInIcon from "react-native-vector-icons/Ionicons"
import CallEndIcon from "react-native-vector-icons/SimpleLineIcons"
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Btn from "../../components/btn";

function IncommingCall({id,rec,rej,userInfo}){
    useEffect(()=>{
        var Sound = require('react-native-sound');

        // Enable playback in silence mode
        Sound.setCategory('Playback');
        
        // Load the sound file 'calling.mp3' from the app bundle
        // See notes below about preloading sounds within initialization code below.
        var calling = new Sound('calling.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          // loaded successfully
          console.log('duration in seconds: ' + calling.getDuration() + 'number of channels: ' + calling.getNumberOfChannels());
        
          // Play the sound with an onEnd callback
          calling.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
          calling.setNumberOfLoops(-1);
        });

        return()=>{
            calling.stop()
        }
    },[])

    function onEndSound(){
        var Sound = require('react-native-sound');

        // Enable playback in silence mode
        Sound.setCategory('Playback');
        
        // Load the sound file 'calling.mp3' from the app bundle
        // See notes below about preloading sounds within initialization code below.
        var calling = new Sound('end_call.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          // loaded successfully
          console.log('duration in seconds: ' + calling.getDuration() + 'number of channels: ' + calling.getNumberOfChannels());
        
          // Play the sound with an onEnd callback
          calling.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        });

    }
    return(
        <ImageBackground 
        source={require('../../../assets/callBg.png')}
        style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontFamily:'Montserrat-Bold',fontSize:responsiveFontSize(3),color:'black'}}>Incomming Call</Text>
           <Image
           style={{
               width:responsiveFontSize(15),
               height:responsiveFontSize(15),
               borderRadius:responsiveFontSize(7.5),
               marginTop:responsiveFontSize(3)
           }}
           source={{uri:userInfo.caller.img}}
           />
           <Text style={{fontFamily:'Montserrat-Medium',color:'grey',fontSize:responsiveFontSize(3),marginTop:responsiveFontSize(2)}}>{userInfo.caller.role}</Text>
            <Text style={{fontFamily:'Montserrat-Bold',color:'#0097e1',fontSize:responsiveFontSize(3)}}>{userInfo.caller.name}</Text>
            <View
            style={{flexDirection:'row',justifyContent:'space-around',width:'100%',marginTop:responsiveFontSize(5)}}
            >
                <TouchableOpacity 
                onPress={rec}
                style={{
                    backgroundColor:'green',
                    width:responsiveFontSize(10),
                    height:responsiveFontSize(10),
                    borderRadius:responsiveFontSize(5),
                    justifyContent:'center',
                    alignItems:'center',
                    ...styles.shadow
                    }}>
                    <CallInIcon
                    name="call-outline"
                    color="white"
                    size={responsiveFontSize(5)}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={rej}
                style={{
                    ...styles.shadow,
                    backgroundColor:'red',
                    width:responsiveFontSize(10),
                    height:responsiveFontSize(10),
                    borderRadius:responsiveFontSize(5),
                    justifyContent:'center',
                    alignItems:'center'
                    }}>
                    <CallEndIcon
                    name="call-end"
                    color="white"
                    size={responsiveFontSize(5)}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles=StyleSheet.create({
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})

export default IncommingCall;