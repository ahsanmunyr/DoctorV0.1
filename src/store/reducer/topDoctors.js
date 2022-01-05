import {
    GET_TOP_DOCTOR
    } from "../action/type"
    
    
    const initialState=[];
    
    
    export default function topDoctors(state=initialState,action){
        switch(action.type){
            case GET_TOP_DOCTOR:
                return action.payload;
            default :
                return state
        }
    }