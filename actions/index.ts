import axios from "axios";
import * as SecureStore from "expo-secure-store"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const loginUser = async (data: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login`,
        data
      );
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  