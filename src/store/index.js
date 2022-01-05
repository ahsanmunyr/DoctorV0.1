import {combineReducers,compose,createStore,applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import user from "./reducer/user";
import notifications from "./reducer/notifications";
import doctors from "./reducer/doctors";
import doctorDetail from "./reducer/doctorDetail";
import categories from "./reducer/categories";
import profile from "./reducer/profile";
import searchDoctorData from "./reducer/searchDoctors";
import times from "./reducer/times";
import topDoctors from "./reducer/topDoctors";
import appointments from "./reducer/appointments";
import firebaseMessages from "./reducer/firebaseMessages";
import conversationUser from "./reducer/conversationUser";
import dashboard from "./reducer/dashboard";
import doctorAppointment from "./reducer/doctorAppointment";
import doctorProfile from "./reducer/doctorProfile";
import recieved from "./reducer/recieved";
import calling from "./reducer/calling";

const appReducer =combineReducers({
    user,
    notifications,
    doctors,
    doctorDetail,
    categories,
    profile,
    searchDoctorData,
    times,
    topDoctors,
    appointments,
    firebaseMessages,
    conversationUser,
    dashboard,
    doctorAppointment,
    doctorProfile,
    recieved,
    calling
})

const reducers = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'USER_LOGGED_OUT') {
      state = undefined;
    }
  
    return appReducer(state, action);
};


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store =createStore(reducers,{},composeEnhancers(applyMiddleware(ReduxThunk)));


export default store