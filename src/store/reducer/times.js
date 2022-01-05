import {
    GET_TIME,
    CLEAR_TIME
    } from "../action/type"
    
    
    const initialState=[];
    
    
    export default function times(state=initialState,action){
        switch(action.type){
            case GET_TIME:
                return action.payload;
            case CLEAR_TIME:
                return action.payload;
            default :
                return state
        }
    }