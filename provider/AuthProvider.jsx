import { createContext, useContext, useReducer, useState } from "react";
import { authReducer, initialAuth } from "../store/authReducer";
import { signOutAction, setSessionAction } from "../store/authActions";
import PropTypes from "prop-types";

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

export function AuthProvider({ children }) {
  const [auth, authDispatch] = useReducer(authReducer, initialAuth);
  const [isPlaying, setPlaying] = useState(true);

  return (
    <AppContext.Provider
      value={{
        auth,
        isPlaying,

        // auth actions
        signOut: signOutAction(authDispatch),
        setSession: setSessionAction(authDispatch),
        togglePlaying: () => setPlaying(!isPlaying),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
