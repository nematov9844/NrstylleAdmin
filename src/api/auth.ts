import { useAxios } from "../hooks/useAxios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
}

export const useAuthApi = () => {
  const axiosRequest = useAxios();
  
  return {
      login: (data: LoginData) => {        
      return axiosRequest({ 
        url: "/login", 
        method: "POST", 
        body: data 
      })
    },

    register: (data: RegisterData) => {
      return axiosRequest({ 
        url: "/user/sign-up", 
        method: "POST", 
        body: data 
      });
    },

    googleLogin: (email: string) => {
      return axiosRequest({ 
        url: "/user/sign-in/google", 
        method: "POST", 
        body: { email } 
      });
    }
  };
}; 