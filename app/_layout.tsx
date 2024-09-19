import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { useCurrentRoute } from "./useCurrentRoute";
import Splash from "@/components/SplashScreen";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";

import { useFonts } from "expo-font";

const publicRoutes = ["/(auth)/Login", "/(auth)/Signup"];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const router = useRouter();
  const currentRoute = useCurrentRoute();

  useEffect(() => {
    if (
      !publicRoutes.includes(currentRoute) &&
      authState.authenticated === false
    ) {
      router.push("/(auth)/Login");
    }
  }, [authState.authenticated, router, currentRoute]);

  if (authState.authenticated === null) {
    return <Splash />;
  }

  return <>{children}</>;
};

const RootLayout = () => {
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      <AuthProvider>
        <Layout>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="(extraroutes)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </Layout>
      </AuthProvider>
    </RootSiblingParent>
  );
};

export default RootLayout;
