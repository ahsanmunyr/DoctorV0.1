import {
    DOCTOR_DASHBOARD
    } from "../action/type"


const initialState={};


export default function dashboard(state=initialState,action){
    switch(action.type){
        case DOCTOR_DASHBOARD:
            return action.payload;
        default :
            return state
    }
}