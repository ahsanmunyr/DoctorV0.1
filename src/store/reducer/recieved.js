import {
    CHANGE_RECIEVED
    } from "../action/type"
    
    
    const initialState=false;
    
    
    export default function recieved(state=initialState,action){
        switch(action.type){
            case CHANGE_RECIEVED:
                return action.payload;
            default :
                return state
        }
    }