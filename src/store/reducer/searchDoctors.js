import {
    Search_DOCTOR
    } from "../action/type"
    
    
    const initialState=[];
    
    
    export default function searchDoctor(state=initialState,action){
        switch(action.type){
            case Search_DOCTOR:
                return action.payload;
            default :
                return state
        }
    }