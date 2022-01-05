import {
    GET_DOCTORS
    } from "../action/type"
    
    
    const initialState=[];
    
    
    export default function doctors(state=initialState,action){
        switch(action.type){
            case GET_DOCTORS:
                return action.payload;
            default :
                return state
        }
    }