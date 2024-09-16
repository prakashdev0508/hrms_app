import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { checkIn, checkOut, getAppHomeDetails } from "@/actions";
import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import moment from "moment";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const [buttonLoader, setButtonLoader] = useState(false);

  console.log(homeData);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await getAppHomeDetails();
      setHomeData(response?.data);
    } catch (error: any) {
      setHomeData(null);
      console.log("errr", error);
    } finally {
      setRefreshing(false);
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
    let { status: initialStatus } =
      await Location.getForegroundPermissionsAsync();

    if (initialStatus !== "granted") {
      let { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (newStatus !== "granted") {
        Toast.show("Permission to access location was denied", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
    }

    setButtonLoader(true);

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const data = {
        date: moment().format("YYYY-MM-DD"),
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      };
      const response = await checkIn(data);

      if (response) {
        fetchData();
        Toast.show("Checked in successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error: any) {
      Toast.show(error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } finally {
      setButtonLoader(false);
    }
  };

  const handleCheckOut = async () => {
    let { status: initialStatus } =
      await Location.getForegroundPermissionsAsync();

    if (initialStatus !== "granted") {
      let { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (newStatus !== "granted") {
        Toast.show("Permission to access location was denied", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
    }

    setButtonLoader(true);

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const data = {
        date: moment().format("YYYY-MM-DD"),
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      };
      const response = await checkOut(data);

      if (response) {
        fetchData();
        Toast.show("Checked out successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error: any) {
      Toast.show(error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } finally {
      setButtonLoader(false);
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

  const getName = (status: string) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late Arrival";
      case "on_leave":
        return "On Leave";
      case "early":
        return "Early Departure";
      case "paid_leave":
        return "Paid Leave";
      case "regularise":
        return "Regularized";
      case "pending_regularize":
        return "Pending Regularization";
      case "checked_in":
        return "Checked In";
      default:
        return "Status Unknown";
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
          <Text className="text-white text-2xl font-bold">
            {homeData?.userDetails?.name}
          </Text>
          <View className="p-6 mt-4">
            <View className="bg-white p-4 rounded-xl shadow-lg">
              <Text className="text-center text-lg font-semibold text-gray-700 mb-2">
                {moment().format("ddd MMM DD, YYYY")}
              </Text>
              <Text className="text-center text-gray-500 mb-4">
                Shift {homeData?.workinghours?.checkinTime} -{" "}
                {homeData?.workinghours?.checkoutTime}
              </Text>
              {homeData?.attendanceStatus == "not_available" && (
                <TouchableOpacity
                  className={` ${
                    buttonLoader
                      ? " bg-green-300 cursor-not-allowed "
                      : "bg-green-500 "
                  } p-4 rounded-lg `}
                  onPress={handleCheckIn}
                  disabled={buttonLoader}
                >
                  <Text className="text-center text-white font-bold text-lg">
                    {buttonLoader ? "Loading..." : "CLOCK IN"}
                  </Text>
                </TouchableOpacity>
              )}
              {homeData?.attendanceStatus == "checked_in" && (
                <TouchableOpacity
                  className={` ${
                    buttonLoader
                      ? " bg-red-300 cursor-not-allowed "
                      : "bg-red-500 "
                  } p-4 rounded-lg `}
                  onPress={handleCheckOut}
                  disabled={buttonLoader}
                >
                  <Text className="text-center text-white font-bold text-lg">
                    {buttonLoader ? "Loading..." : "CLOCK OUT"}
                  </Text>
                </TouchableOpacity>
              )}

              {homeData?.attendanceStatus != "checked_in" &&
                homeData?.attendanceStatus != "not_available" && (
                  <TouchableOpacity className={` bg-gray-500  p-4 rounded-lg `}>
                    <Text className="text-center text-white font-bold text-lg">
                      {getName(homeData?.attendanceStatus)}
                    </Text>
                  </TouchableOpacity>
                )}
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
