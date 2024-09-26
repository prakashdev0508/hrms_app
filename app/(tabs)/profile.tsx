import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getuserProfile } from "@/actions";

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getuserProfile();
      console.log(response);
      setProfileData(response?.data);
    } catch (error) {
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getuserProfile();
      console.log("res", response);
      setProfileData(response?.data);
    } catch (error) {
      setProfileData(null);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="p-2"
      >
        {loading ? (
          <>
            <View className=" flex-row justify-center align-middle min-h-screen ">
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className=" flex-row justify-center align-middle min-h-screen "
              />
            </View>
          </>
        ) : (
          <>
            <View className="flex-row mt-5 border rounded-md border-gray-300 p-2">
              <View className="border border-white h-16 w-16 bg-red-400 rounded-full items-center justify-center">
                <Text className="text-center text-4xl font-bold text-white">
                  {profileData?.user?.name[0]}
                </Text>
              </View>
              <View className=" w-[1.3px] bg-gray-300 mx-3 "></View>
              <View className="">
                <Text className=" font-bold text-lg">
                  {profileData?.user?.name}
                </Text>
                <Text className="text-sm">
                  {profileData?.user?.organizationId?.name}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
