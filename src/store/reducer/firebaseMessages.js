import {
FETCH_MESSAGES,
CLEAR_CHAT
} from "../action/type"
import _ from "lodash"
    
const initialState=[];


export default function firebaseMessages(state=initialState,action){
    switch(action.type){
        case FETCH_MESSAGES:
            return _.uniqBy([...state,...action.payload], function (e) {
                return e._id;
                });
        case CLEAR_CHAT:
            return action.payload;
        default :
            return state
    }
}