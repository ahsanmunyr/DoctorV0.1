import {
LOGIN
} from "../action/type"


const initialState={};


export default function user(state=initialState,action){
    switch(action.type){
        case LOGIN:
            return action.payload;
        default :
            return state
    }
}