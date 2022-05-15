import Cookie from "js-cookie";
import {
  useReducer,
  createContext,
  ReactFragment,
  FC,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/router";

import Axios from "../axios-url";
import { AuthContextType, IUser } from "../types/types";

type Props = {
  children: ReactFragment;
};

const initialState = {
  user: null,
};

const AuthContext = createContext({} as AuthContextType);

const rootReducer = (
  state: { user: IUser },
  action: { type: any; payload?: any }
) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };

    default:
      return state;
  }
};

const AuthContextProvider: FC<Props> = (props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [csrfToken, setCsrfToken] = useState("");
  const [accessToken, setAccessToken] = useState(Cookie.get("token"));
  const router = useRouter();

  const getTokens = useCallback(async () => {
    const { data } = await Axios.get("/user/loggedIn");
    setAccessToken(data);
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(String(localStorage.getItem("user"))),
    });
    const csrfResponse = await Axios.get("/user/csrf-token");
    setCsrfToken(csrfResponse.data.csrfToken);
  }, []);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  Axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((_resolve, reject) => {
          Axios.get("/user/logout")
            .then((_data) => {
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{ state, dispatch, csrfToken, accessToken, setAccessToken }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
