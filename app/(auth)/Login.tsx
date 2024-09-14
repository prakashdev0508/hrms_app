import { Link, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-root-toast";

const SignIn = () => {
  const { onLogin, loading } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (form.username.trim() == "" || form.password.trim() == "") {
      return Toast.show("Please Fill all details ");
    }

    const data = {
      username: form.username.trim(),
      password: form.password.trim(),
    };

    onLogin(data);
  }, [form]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="username"
            placeholder="Enter username"
            icon={icons.person}
            textContentType="username"
            value={form.username}
            onChangeText={(value) => setForm({ ...form, username: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-10"
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
