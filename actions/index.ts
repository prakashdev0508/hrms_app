import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-root-toast";
import { router } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
let token: any = null;

export const getToken = async () => {
  token = await SecureStore.getItemAsync("accessToken");
};

const redirectLogin = async ()=>{
  Toast.show("Your password is changed Please Login again")
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("role");
  await SecureStore.deleteItemAsync("organizationDetails");
  router.push("/(auth)/Login");
}

export const loginUser = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppHomeDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/app/home`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if(error.response.data.message == "Password changed. Please login again."){
      redirectLogin()
    }
    throw error;
  }
};

export const checkIn = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/attendence/check-in`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const checkOut = async (data: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/attendence/check-out`,
      data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getRequestList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/app/request_data`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if(error.response.data.message == "Password changed. Please login again."){
      redirectLogin()
    }
    throw error;
  }
};

getToken();
