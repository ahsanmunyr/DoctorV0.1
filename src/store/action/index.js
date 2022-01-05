import axios from "axios"
import {
    BOOK_APPOINTMENT,
    CLEAR_TIME,
    GET_APPOINTMENT,
    GET_CATEGORIES,
    GET_DOCTORS,
    GET_DOCTOR_DETAIL,
    GET_NOTIFICATION,
    GET_PROFILE,
    GET_TIME,
    GET_TOP_DOCTOR,
    LOGIN,
    Search_DOCTOR,
    FETCH_MESSAGES,
    FETCH_USER,
    CLEAR_CHAT,
    DOCTOR_DASHBOARD,
    GET_DOCTOR_APPOINTMENT,
    GET_DOCTOR_PROFILE,
    CHANGE_RECIEVED,
    CALLING,
    CALLEINFO
} from "./type"
import AsyncStorage from "@react-native-community/async-storage"
import {api} from "../../config/config.json"  
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';                                                                   

const doctor=axios.create({
    baseURL: api
  });

export const login=(data)=>async dispatch=>{
    const res=await doctor.post(`/api/user/login`,data)
    if(res.data.status){
        await AsyncStorage.setItem('user',JSON.stringify(res.data.data))
        const user={
            id: res.data.data.user_id,
            name: res.data.data.first_name+" "+res.data.data.last_name,
            login: data.password,
            password: data.password
        }
        dispatch({
            type:LOGIN,
            payload:res.data.data
        })
        return
    }
    dispatch({
        type:LOGIN,
        payload:res.data
    })
}

export const setUserOnload=(user)=>async dispatch=>{
    dispatch({
        type:LOGIN,
        payload:user
    })
}

export const logOut=()=>async dispatch=>{
    await AsyncStorage.removeItem('user')
    dispatch({
        type:"USER_LOGGED_OUT"
    })
}

export const registration=(data)=>async dispatch=>{
    data={...data,role:'Patient'}
    const res=await doctor.post(`/api/user/signUp`,data)
    if(res.data.status){
        await AsyncStorage.setItem('user',JSON.stringify(res.data.data))
        dispatch({
            type:LOGIN,
            payload:res.data.data
        })
        return
    }
    dispatch({
        type:LOGIN,
        payload:res.data
    })

}

export const forgetPassword=(email)=>async dispatch=>{
    const res=await doctor.post(`/api/user/forgotPassword`,{email:email})
    return res.data
}

export const getProfile=(id)=>async dispatch=>{
    const res=await doctor.post(`/api/user/getProfile`,{userId:id})
    dispatch({
        type:GET_PROFILE,
        payload:res.data.data
    })
}

export const editProfile=(data)=>async dispatch=>{
    const bodyForm=new FormData();
    const updateData={
        firstname:data.first_name,
        lastname:data.last_name,
        mobileno:data.mobile_no,
        address:data.address,
        id:data.id,
    }

    if(data.user_image.path){
        updateData.isimage="yes"
        var file={
            uri:data.user_image.path,
            name:data.user_image.path.slice(data.user_image.path.lastIndexOf('/')+1,data.user_image.path.length),
            type:data.user_image.mime
        }
        bodyForm.append('file',file)
    }else{
        updateData.isimage=false
    }

    const res=await doctor.post(`/api/user/updateProfile`,updateData.isimage?bodyForm:null,{
        headers:{ "Content-Type": "multipart/form-data",...updateData },
    });
    return res.data
}


export const getNotifications=(id)=>async dispatch=>{

    const res=await doctor.post(`/api/notification/getNotificationByuser`,{id:id});
    dispatch({
        type:GET_NOTIFICATION,
        payload:res.data.data.result
    })
}

export const getDoctors=()=>async dispatch=>{

    const res=await doctor.get(`/api/doctor/getAllDoctorsByPatient`);
    dispatch({
        type:GET_DOCTORS,
        payload:res.data.data
    })
}
    
export const getDoctorDetail=(id)=>async dispatch=>{

    const res=await doctor.post(`/api/doctor/getDoctorById`,{drId:id});
    dispatch({
        type:GET_DOCTOR_DETAIL,
        payload:res.data.data
    })
}

export const getTime=(data)=>async dispatch=>{
    const res=await doctor.post(`/api/appointment/getAllTimeSlotsByAppointmentDate`,data);
    dispatch({
        type:GET_TIME,
        payload:res.data.data
    })
}

export const clearTimes=()=>async dispatch=>{
    dispatch({
        type:CLEAR_TIME,
        payload:[]
    })
}

export const getCategories=()=>async dispatch=>{

    const res=await doctor.get(`/api/category/getAllCategoryByUser`);
    dispatch({
        type:GET_CATEGORIES,
        payload:res.data.data
    })
}

export const searchDoctor=(text)=>async dispatch=>{

    const res=await doctor.post(`/api/doctor/searchDr`,{text});
    dispatch({
        type:Search_DOCTOR,
        payload:res.data.data
    })
}

export const getTopDoctors=()=>async dispatch=>{

    const res=await doctor.post(`/api/doctor/getTopDr`);
    dispatch({
        type:GET_TOP_DOCTOR,
        payload:res.data.data
    })
}

export const bookAppointMent=(data)=>async dispatch=>{
    const res=await doctor.post(`/api/appointment/createAppointment`,data);
    if(res.data.status==1){
        return res.data.data
    }else{
        alert("something goes wrong")
    }
}

export const getAppointmentList=(userId)=>async dispatch=>{
    const res=await doctor.post(`/api/appointment/getAppointmentList`,{userId});
    dispatch({
        type:GET_APPOINTMENT,
        payload:res.data.data
    })
}

export const searhByDay=(day)=>async dispatch=>{
    const res=await doctor.post(`/api/doctor/searchDrByDay`,{day});
    dispatch({
        type:Search_DOCTOR,
        payload:res.data.data
    })
}

// DOCTOR APIS


export const doctorLogin=(data)=>async dispatch=>{
    const res=await doctor.post(`/api/user/loginDr`,data)
    if(res.data.status){
        await AsyncStorage.setItem('user',JSON.stringify(res.data.data))
        const user={
            id: res.data.data.user_id,
            name: res.data.data.first_name,
            password: data.password
        }
        
          dispatch({
            type:LOGIN,
            payload:res.data.data
        })
        return
    }
    dispatch({
        type:LOGIN,
        payload:res.data
    })
}

export const getDashBoard=(drId)=>async dispatch=>{
    const res=await doctor.post(`/api/dashboard/getMonthlyAmountStats`,{drId})
    dispatch({
        type:DOCTOR_DASHBOARD,
        payload:res.data.data
    })
}

export const getDoctorAppointment=(drId)=>async dispatch=>{
    const res=await doctor.post(`/api/appointment/getAppointmentListForDr`,{drId})
    dispatch({
        type:GET_DOCTOR_APPOINTMENT,
        payload:res.data.data
    })
}

export const getDoctorProfile=(drId)=>async dispatch=>{
    const res=await doctor.post(`/api/doctor/getDrProfile`,{drId})
    dispatch({
        type:GET_DOCTOR_PROFILE,
        payload:res.data.data
    })
}








/// chat



export const sendMessage=(message,userId,rec,userName,url)=>async dispatch=>{
    function mergeId(id1,id2){
        if(id1<id2){
            return id1+id2
        }else{
            return id2+id1
        }
    }
    firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).add({...message[0],timeStamp:firestore.FieldValue.serverTimestamp(),received:false,userId:message[0].user._id})
    firestore().collection("chat").doc("user").collection(rec.id).where('id','==',userId).get().then((res)=>{
        if(!res.size){
            // add
            // firestore().collection("userList").add({id:rec.id})
            firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).where('received','==',false).where('userId','==',userId).get().then((res2)=>{
                firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).orderBy('createdAt','asc').limit(1).get().then((res3)=>{
                    res3.forEach((snap)=>{
                        firestore().collection("chat").doc("user").collection(rec.id).add({name:userName,id:userId,url:url,count:res2.size,message:snap.data()})
                    })
                })
            })
            // firestore().collection("chat").doc("user").collection(message[0].user.name).add({...message[0],received:false,count:res2.size})
        }else{
            const batch=firestore().batch()
            firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).where('received','==',false).where('userId','==',userId).get().then((res2)=>{
                firestore().collection("chat").doc("conversation").collection(mergeId(userId,rec.id.toString())).orderBy('createdAt','desc').limit(1).get().then((res3)=>{
                    res3.forEach((snap)=>{
                        firestore().collection("chat").doc("user").collection(rec.id).where("id","==",userId).get().then((userFromList)=>{
                            userFromList.forEach((snapData)=>{
                                snapData.ref.set({name:userName,id:userId,url:url,count:res2.size,message:snap.data()})
                            })
                        })
                    })
                })
            })
        }
    })




    firestore().collection("chat").doc("user").collection(userId).where('id','==',rec.id).get().then((res)=>{
        if(!res.size){
            //add
            // firestore().collection("userList").add({id:userId})
            firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).where('received','==',false).where('userId','==',rec.id).get().then((res2)=>{
                firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),rec.id.toString())).orderBy('createdAt','asc').limit(1).get().then((res3)=>{
                    res3.forEach((snap)=>{
                        firestore().collection("chat").doc("user").collection(userId).add({...rec,count:res2.size,message:snap.data()})
                    })
                })
            })
            // firestore().collection("chat").doc("user").collection(message[0].user.name).add({...message[0],received:false,count:res2.size})
        }else{
            firestore().collection("chat").doc("conversation").collection(mergeId(userId,rec.id.toString())).where('received','==',false).where('userId','==',rec.id).get().then((res2)=>{

                firestore().collection("chat").doc("conversation").collection(mergeId(userId,rec.id.toString())).orderBy('createdAt','desc').limit(1).get().then((res3)=>{
                    res3.forEach((snap)=>{
                        firestore().collection("chat").doc("user").collection(userId).where("id","==",rec.id).get().then((userFromList)=>{
                            userFromList.forEach((snapData)=>{
                                snapData.ref.set({...rec,count:res2.size,message:snap.data()})
                            })
                        })
                    })
                })
            })
        }
    })
    
}

export const getMessages=(userId,recId,date,readMessages)=>async dispatch=>{
    function mergeId(id1,id2){
        if(id1<id2){
            return id1+id2
        }else{
            return id2+id1
        }
    }
    const unSubscribe=firestore().collection('chat').doc("conversation").collection(mergeId(userId,recId.toString())).orderBy("timeStamp","desc").startAfter(date?date:"11").limit(15).onSnapshot((documentSnapshot)=>{
        readMessages()
        const data=[]
        if(documentSnapshot.size){
            documentSnapshot.forEach((snap)=>{
                data.push(snap.data())
            })
        }
        if(data.length>0){
            if(data[0].timeStamp){
                dispatch({
                    type:FETCH_MESSAGES,
                    payload:data
                })
            }
        }
    })
    return  unSubscribe
}

export const clearChat=()=>async dispatch=>{
    dispatch({
        type:CLEAR_CHAT,
        payload:[]
    })
}


export const getChatUsers=(userName,userId)=>async dispatch=>{
    

    if(userId){
        firestore().collection('chat').doc("user").collection(userId.toString()).onSnapshot((documentSnapshot)=>{
            
            const data=[]
            if(documentSnapshot.size){
                documentSnapshot.forEach((snap)=>{
                    data.push(snap.data())
                })
            }
            dispatch({
                type:FETCH_USER,
                payload:data
            })
        })
    }
}

export const readMessages=(userId,recId,userName,recName)=>async dispatch=>{
    function mergeId(id1,id2){
        if(id1<id2){
            return id1+id2
        }else{
            return id2+id1
        }
    }
    firestore().collection("chat").doc("user").collection(userId).where("name","==",recName).get().then(data=>{
        if(data.size){
            data.forEach(snap=>{
                snap.ref.update({count:0})
            })
        }

    })
    firestore().collection("chat").doc("conversation").collection(mergeId(userId.toString(),recId.toString())).where("userId","==",recId).get().then(data=>{
        data.forEach(snap=>{
            snap.ref.update({received:true})
        })

    })
    

}

export const setOnlineStatus=(user)=>async dispatch=>{
        const reference = database().ref(`/onlineUsers/${user.id.toString()}`)
        .set(user).then(()=>{
            console.log("set data")
        }).catch(err=>console.log("eer",err))
        console.log(user)
        // firestore().collection("chat").doc("onlineUsers").collection(user.name+user.id).doc('status').set(user)
        database().ref(`/onlineUsers/${user.id.toString()}`).onDisconnect().remove().then(()=>{
            console.log("remove")
        })
}

export const removeOnlineStatus=(id)=>async dispatch=>{
    await database().ref(`/onlineUsers/${id.toString()}`).remove()
}

/// chat end


export const setMobileToken=(token,user)=>async dispatch=>{
    if(user.role=="Dr"){
        await doctor.post(`/api/doctor/saveDoctorMobileToken`,{token,drId:user.user_id})
    }else{
        await doctor.post(`/api/user/saveUserMobileToken`,{token,userId:user.user_id})
    }
}

export const getMobileToken=(name,msg,token)=>async(dispatch)=>{
    // alert(token)
    const res2=await axios.post('https://fcm.googleapis.com/fcm/send',{
        "to":token,
        "collapse_key":name,
        "notification":{
        "body":msg,
        "title":name
        }
    },{
    headers:{
        "Content-Type": "application/json",
        "Authorization":"key=AAAAAWxmL7g:APA91bEJpId3CIpCaI6kWSP3ewHKrOWV0n7zz7Zb8387da2892Q4H_FL_ooG0AjvOgB_IvTTODXXFPZPiAaI8MSE1MJSgnYkvCJgUpm1cTnMH2tuKygB19cpwTSx80UWR9eytkhsEqTt"
    }
    }).then(r=>console.log(r.data))

}

export const setCalling=(status)=>async(dispatch)=>{
    console.log("callllllllllllling",status)
    dispatch({
        type:CALLING,
        payload:status
    })
}

export const changeRecieved=(status)=>async(dispatch)=>{
    dispatch({
        type:CHANGE_RECIEVED,
        payload:status
    })
}

export const callRequest=(data,mobileToken,cb)=>async(dispatch)=>{
    const res2=await axios.post('https://fcm.googleapis.com/fcm/send',{
          "to":mobileToken,
          "collapse_key":data.caller.name,
          "notification":{
            "body":"calling",
            "title":data.caller.name
          },
          "data":{data:JSON.stringify(data)}
      },{
        headers:{
          "Content-Type": "application/json",
          "Authorization":"key=AAAAAWxmL7g:APA91bEJpId3CIpCaI6kWSP3ewHKrOWV0n7zz7Zb8387da2892Q4H_FL_ooG0AjvOgB_IvTTODXXFPZPiAaI8MSE1MJSgnYkvCJgUpm1cTnMH2tuKygB19cpwTSx80UWR9eytkhsEqTt"
        }
      }).then(r=>console.log(r.data))
    cb?cb():null
}

export const rejectCall=(mobileToken,id)=>async(dispatch)=>{
    if(mobileToken){
        const res2=await axios.post('https://fcm.googleapis.com/fcm/send',{
            "to":mobileToken,
            "collapse_key":mobileToken,
            "notification":{
              "body":"",
              "title":"Reject Call"
            },
            "data":{data:JSON.stringify({cancel:true,id})}
        },{
          headers:{
            "Content-Type": "application/json",
            "Authorization":"key=AAAAAWxmL7g:APA91bEJpId3CIpCaI6kWSP3ewHKrOWV0n7zz7Zb8387da2892Q4H_FL_ooG0AjvOgB_IvTTODXXFPZPiAaI8MSE1MJSgnYkvCJgUpm1cTnMH2tuKygB19cpwTSx80UWR9eytkhsEqTt"
          }
        }).then(r=>console.log(r.data))
    }
}

export const getToken=(userId,role)=>async(dispatch)=>{
    const res=await doctor.post('/api/user/getUserMobileToken',{userId,role})
    console.log(res.data.data)
    return{
        mobileToken:res.data.data?.mobile_token
    }
}