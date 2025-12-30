import { createContext, useEffect, useReducer, useState } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { emp: action.payload };
    case "LOGOUT":
      return { emp: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    emp: null,
  });

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedEmp = localStorage.getItem("employee");
    if (storedEmp) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedEmp) });
    }
    setAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
