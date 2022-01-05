import {
    GET_DOCTOR_PROFILE
    } from "../action/type"
    
    
    const initialState={};
    
    
    export default function doctorProfile(state=initialState,action){
        switch(action.type){
            case GET_DOCTOR_PROFILE:
                return action.payload;
            default :
                return state
        }
    }