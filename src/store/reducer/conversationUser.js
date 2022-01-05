import {
    FETCH_USER
    } from "../action/type"
import _ from "lodash"
    
    
    const initialState=[];
    
    
    export default function chatUsers(state=initialState,action){
        switch(action.type){
            case FETCH_USER:
                return  _.uniqBy(action.payload, function (e) {
                    return e.id;
                  });;
            default :
                return state
        }
    }