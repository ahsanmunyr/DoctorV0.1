import {
    GET_DOCTOR_APPOINTMENT,
    } from "../action/type"
    
    
    const initialState=[
        {deactiveData:[]},
        {activeData:[]}
    ];
    
    
    export default function doctorAppointment(state=initialState,action){
        switch(action.type){
            case GET_DOCTOR_APPOINTMENT:
                return action.payload;
            default :
                return state
        }
    }