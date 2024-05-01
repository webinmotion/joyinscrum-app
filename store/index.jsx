import { createContext, useContext, useReducer } from "react";
import { authReducer, initialAuth, } from './authReducer';
import { signOutAction, setSessionAction, } from "./authActions";
import PropTypes from 'prop-types';

const AppContext = createContext(null)

export function useAppContext() {
    return useContext(AppContext)
}

export function AppContextProvider({ children }) {

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

AppContextProvider.propTypes = {

    children: PropTypes.object.isRequired
}