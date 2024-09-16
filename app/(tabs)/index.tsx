import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { checkIn, getAppHomeDetails } from "@/actions";
import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import moment from 'moment';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);

  console.log(homeData)

  const fetchData = async () => {
    setRefreshing(true)
    try {
      const response = await getAppHomeDetails();
      setHomeData(response?.data);
    } catch (error: any) {
      setHomeData(null);
      console.log("errr", error);
    }finally{
      setRefreshing(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchData(); 
      console.log("Data refreshed");
      setRefreshing(false);
    }, 2000);
  };
  const handleCheckIn = async () => {
    let { status: initialStatus } = await Location.getForegroundPermissionsAsync();
  
    if (initialStatus !== "granted") {
      let { status: newStatus } = await Location.requestForegroundPermissionsAsync();
  
      if (newStatus !== "granted") {
        Toast.show("Permission to access location was denied", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
    }
  
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const data = {
        date : moment().format('YYYY-MM-DD'),
        location : {
          latitude : currentLocation.coords.latitude,
          longitude : currentLocation.coords.longitude
        }
      }

      console.log("Data send" , data)

      const response = await checkIn(data)
  
      if (response) {
        fetchData()
        Toast.show("Checked in successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
        }
    } catch (error : any) {
      Toast.show( error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      return "Good Night 🌙";
    } else if (hour >= 6 && hour < 12) {
      return "Good Morning ☀️";
    } else if (hour >= 12 && hour < 16) {
      return "Good Afternoon 🌤️";
    } else {
      return "Good Evening 🌥️";
    }
  };
  

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="bg-purple-600 p-4 rounded-b-3xl z-10">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-sm">{getGreeting()}</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{homeData?.userDetails?.name}</Text>
          <View className="p-6 mt-4">
            <View className="bg-white p-4 rounded-xl shadow-lg">
              <Text className="text-center text-lg font-semibold text-gray-700 mb-2">
                Sat Sep 14, 2024
              </Text>
              <Text className="text-center text-gray-500 mb-4">
                Shift 04:30:00 - 13:30:00
              </Text>
              
              <TouchableOpacity
                className="bg-green-500 p-4 rounded-lg"
                onPress={handleCheckIn}
              >
                <Text className="text-center text-white font-bold text-lg">
                  CLOCK IN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Workbox Section */}
        <View className="p-4">
          <Text className="font-bold text-gray-600 text-lg">
            Workbox (Your Actionables)
          </Text>
          <View className="flex-row justify-between mt-4">
            {/* Workbox Icons */}
            <View className="items-center">
              <FontAwesome name="check-circle" size={32} color="orange" />
              <Text>Approvals</Text>
              <Text>0</Text>
            </View>
            <View className="items-center">
              <FontAwesome name="paper-plane" size={32} color="orange" />
              <Text>My Requests</Text>
              <Text>0</Text>
            </View>
            <View className="items-center">
              <FontAwesome name="envelope" size={32} color="orange" />
              <Text>Survey</Text>
              <Text>0</Text>
            </View>
            <View className="items-center">
              <FontAwesome name="tasks" size={32} color="orange" />
              <Text>Tasks</Text>
              <Text>0</Text>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View className="p-4 bg-gray-100">
          <Text className="font-bold text-gray-600 text-lg mb-4">Overview</Text>
          <View className="flex-row justify-around">
            <View className="bg-white p-4 rounded-lg shadow-lg w-2/5">
              <Text className="text-center text-xl font-bold text-blue-600">
                11
              </Text>
              <Text className="text-center text-gray-500">Attendance Days</Text>
            </View>
            <View className="bg-white p-4 rounded-lg shadow-lg w-2/5">
              <Text className="text-center text-xl font-bold text-green-600">
                9.5
              </Text>
              <Text className="text-center text-gray-500">
                Leaves Available
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
