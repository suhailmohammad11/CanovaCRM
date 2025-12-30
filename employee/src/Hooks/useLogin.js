import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/employees/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return false;
      }
      const employee = {
        email: data.email,
        id: data.id,
        token: data.token,
      };
      localStorage.setItem("employee", JSON.stringify(employee));
      dispatch({ type: "LOGIN", payload: employee });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  return { login };
};
