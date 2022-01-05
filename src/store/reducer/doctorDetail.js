import {
    GET_DOCTOR_DETAIL
    } from "../action/type"
    
    
    const initialState={};
    
    
    export default function doctorDetail(state=initialState,action){
        switch(action.type){
            case GET_DOCTOR_DETAIL:
                return action.payload;
            default :
                return state
        }
    }