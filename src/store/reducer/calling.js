import {
    CALLING
    } from "../action/type"
    
    
    const initialState=false
    
    
    export default function calling(state=initialState,action){
        switch(action.type){
            case CALLING:
                return action.payload;
            default :
                return state
        }
    }