import { createContext, useContext, useReducer } from "react";
import { authReducer, initialAuth, } from '../store/authReducer';
import { signOutAction, setSessionAction, } from "../store/authActions";
import PropTypes from 'prop-types';

const AppContext = createContext(null)

export function useAppContext() {
    return useContext(AppContext)
}

export function AuthProvider({ children }) {

    const [auth, authDispatch] = useReducer(authReducer, initialAuth);

    return <AppContext.Provider value={{
        auth,

        // auth actions
        signOut: signOutAction(authDispatch),
        setSession: setSessionAction(authDispatch),
    }}>
        {children}
    </AppContext.Provider>

}

AuthProvider.propTypes = {
    children: PropTypes.object.isRequired
}