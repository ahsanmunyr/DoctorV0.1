import React from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native"
import {responsiveFontSize,responsiveWidth,responsiveHeight} from "react-native-responsive-dimensions"
import ArrowIcon from "react-native-vector-icons/AntDesign";
import {useTheme} from "@react-navigation/native"

function DoctorComponent({price,cat,name,img,call}){
    const {colors}=useTheme()
    return(
            <TouchableOpacity 
            onPress={call}
            style={{flexDirection:'row',alignItems:'center',width:'95%',...styles.doc}}>
                <View style={{width:'25%'}}>
                    <Image
                    source={img}
                    style={{width:responsiveFontSize(7),height:responsiveFontSize(7),borderRadius:responsiveFontSize(7)/2}}
                    />
                </View>
                <View style={{width:'50%'}}>
                    <Text style={{color:colors.text,fontFamily:'Montserrat-Medium'}}>{name}</Text>
                    <Text style={{fontSize:responsiveFontSize(1.5),color:'grey'}}>{cat}</Text>
                    <Text style={{fontSize:responsiveFontSize(1.5),color:'grey'}}>Fee: <Text style={{color:'green'}}>${price}</Text></Text>
                </View>
                <View style={{width:'25%',alignItems:'flex-end'}}>
                    <TouchableOpacity 
                    style={{
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:'#fab701',
                        height:responsiveFontSize(5),
                        width:responsiveFontSize(5),
                        borderRadius:responsiveFontSize(5)/2
                        }}>
                        <ArrowIcon
                        name="arrowright"
                        size={responsiveFontSize(2)}
                        color="white"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
    )
}
const styles=StyleSheet.create({
    doc:{
        padding:responsiveFontSize(2),
        backgroundColor:'white',
        borderRadius:responsiveFontSize(1),
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

export default DoctorComponent;