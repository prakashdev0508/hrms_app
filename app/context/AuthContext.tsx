import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser } from "@/actions";
import { ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-root-toast";

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
}

interface AuthContextType {
  authState: AuthState;
  onLogin: (data: any) => Promise<void | { error: boolean; msg: string }>;
  onLogout: () => Promise<void>;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
}

const TOKEN_KEY = "accessToken";
export const API_URL = "";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadToken = async () => {
    setLoading(true);
    const token = await SecureStore.getItem(TOKEN_KEY);
    if (token) {
      setAuthState({
        token,
        authenticated: true,
      });
    } else {
      setAuthState({
        token: null,
        authenticated: false,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      setAuthState({
        token: response?.token || "",
        authenticated: true,
      });
      await SecureStore.setItemAsync(TOKEN_KEY, response?.token);
      await SecureStore.setItemAsync("role", response?.role);
      await SecureStore.setItemAsync(
        "organizationDetails",
        response?.organizationId
      );
      router.push("/(tabs)");
      ToastAndroid.show("Logged In", ToastAndroid.TOP);
    } catch (error: any) {
      // ToastAndroid.show(error?.response?.data?.message, ToastAndroid.BOTTOM);
      Toast.show(error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      return { error: true, msg: error?.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("organizationDetails");
    router.push("/(auth)/Login");
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value: AuthContextType = {
    authState,
    onLogin: login,
    onLogout: logout,
    setAuthState,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
