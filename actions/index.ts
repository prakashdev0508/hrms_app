import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
let token: any = null;

const getToken = async () => {
  token = await SecureStore.getItemAsync("accessToken");
};

getToken();

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
