import {
    GET_APPOINTMENT,
    GET_CATEGORIES
    } from "../action/type"
    
    
    const initialState=[
        {deactiveData:[]},
        {activeData:[]}
    ];
    
    
    export default function appointments(state=initialState,action){
        switch(action.type){
            case GET_APPOINTMENT:
                return action.payload;
            default :
                return state
        }
    }