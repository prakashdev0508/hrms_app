import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { checkIn, checkOut, getAppHomeDetails, getToken } from "@/actions";
import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import moment from "moment";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadData, setLoadData] = useState(false);

  const plusDropdownAnim = useRef(new Animated.Value(0)).current;
  const userDropdownAnim = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    setLoadData(true);
    try {
      const response = await getAppHomeDetails();
      setHomeData(response?.data);
    } catch (error: any) {
      setHomeData(null);
      console.log("errr", error);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchData();
    getToken();
  }, []);

  const onRefresh = async () => {
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
      case "half_day":
        return "Half Day";
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

  const togglePlusDropdown = () => {
    setShowPlusDropdown(!showPlusDropdown);
    setShowUserDropdown(false);

    Animated.timing(plusDropdownAnim, {
      toValue: showPlusDropdown ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowPlusDropdown(false);

    Animated.timing(userDropdownAnim, {
      toValue: showUserDropdown ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleOutsideClick = (event: any) => {
    if (!event.target.closest(".dropdown")) {
      setShowPlusDropdown(false);
      setShowUserDropdown(false);
    }
  };

  return (
    <View className="bg-white flex-1 ">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loadData ? (
          <View className=" flex-row justify-center align-middle min-h-screen ">
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className=" flex-row justify-center align-middle min-h-screen "
            />
          </View>
        ) : (
          <>
            {/* Header Section */}
            <View className="bg-purple-800 p-4 rounded-b-3xl z-10">
              <View className="flex-row justify-between mt-8">
                <View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-sm">{getGreeting()}</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {homeData?.userDetails?.name}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-4">
                  <TouchableOpacity onPress={togglePlusDropdown}>
                    <AntDesign name="pluscircle" size={32} color="white" />
                  </TouchableOpacity>
                  {showPlusDropdown && (
                    <Animated.View
                      style={[
                        styles.dropdown,
                        {
                          opacity: plusDropdownAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                          transform: [
                            {
                              translateY: plusDropdownAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                      className="absolute right-10 top-12 bg-white rounded-md shadow-lg p-2 z-50 border border-gray-300 dropdown"
                    >
                      <Link
                        href={"/(extraroutes)/applyleave"}
                        className=" mx-1 mb-4 "
                        onPress={() => setShowPlusDropdown(false)}
                      >
                        <Text>Apply Leave Request</Text>
                      </Link>
                      <Link
                        href={"/(extraroutes)/applyregularisation"}
                        className=" mx-1 "
                        onPress={() => setShowPlusDropdown(false)}
                      >
                        <Text>Apply Regularisation</Text>
                      </Link>
                    </Animated.View>
                  )}

                  <TouchableOpacity onPress={toggleUserDropdown}>
                    <FontAwesome name="user-circle" size={32} color="white" />
                  </TouchableOpacity>
                  {showUserDropdown && (
                    <Animated.View
                      style={[
                        styles.dropdown,
                        {
                          opacity: userDropdownAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                          transform: [
                            {
                              translateY: userDropdownAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                      className="absolute right-2 top-12 bg-white rounded-md shadow-lg p-2 z-50 border border-gray-300 dropdown"
                    >
                      <TouchableOpacity
                        onPress={() => console.log("Profile clicked")}
                      >
                        <Text className="p-2">Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => console.log("Logout clicked")}
                      >
                        <Text className="p-2">Logout</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>

              <View className="p-6 mt-10">
                <View className="bg-white p-4 rounded-xl shadow-lg">
                  <Text className="text-center text-lg font-semibold text-gray-700 mb-2">
                    {moment().format("ddd MMM DD, YYYY")}
                  </Text>
                  <Text className="text-center text-gray-500 mb-4">
                    Shift {homeData?.userDetails?.checkInTime} -{" "}
                    {homeData?.userDetails?.checkOutTime}
                  </Text>
                  {(homeData?.attendanceStatus == "not_available" ||
                    homeData?.attendanceStatus == "paid_leave") && (
                    <TouchableOpacity
                      className={`${
                        buttonLoader
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500"
                      } p-4 rounded-lg`}
                      onPress={handleCheckIn}
                      disabled={buttonLoader}
                    >
                      <Text className="text-center text-white font-bold text-lg">
                        {buttonLoader ? "Loading..." : "CLOCK IN"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {(homeData?.attendanceStatus == "checked_in" ||
                    (homeData?.attendanceStatus == "checked_in" &&
                      homeData?.attendanceStatus == "paid_leave")) && (
                    <TouchableOpacity
                      className={`${
                        buttonLoader
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500"
                      } p-4 rounded-lg`}
                      onPress={handleCheckOut}
                      disabled={buttonLoader}
                    >
                      <Text className="text-center text-white font-bold text-lg">
                        {buttonLoader ? "Loading..." : "CLOCK OUT"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {homeData?.attendanceStatus != "checked_in" &&
                    homeData?.attendanceStatus != "paid_leave" &&
                    homeData?.attendanceStatus != "not_available" && (
                      <View
                        className={`bg-gray-500 p-4 rounded-lg w-full text-center py-3`}
                      >
                        <Text className="text-center text-white font-bold text-lg">
                          {getName(homeData?.attendanceStatus)}
                        </Text>
                      </View>
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
                  <FontAwesome name="paper-plane" size={32} color="orange" />
                  <Text>My Requests</Text>
                  <Text>{homeData?.requests?.allRequests}</Text>
                </View>
                <View className="items-center">
                  <FontAwesome name="check-circle" size={32} color="orange" />
                  <Text>Approvals</Text>
                  <Text>{homeData?.requests?.approvedLeaves}</Text>
                </View>

                <View className="items-center">
                  <Entypo name="circle-with-cross" size={32} color="orange" />
                  <Text>Rejected </Text>
                  <Text>{homeData?.requests?.rejectedRequests}</Text>
                </View>
                <View className="items-center">
                  <MaterialIcons name="pending" size={32} color="orange" />
                  <Text>Pending </Text>
                  <Text>{homeData?.requests?.pendingRequests}</Text>
                </View>
              </View>
            </View>

            {/* Overview Section */}
            <View className="p-4 bg-gray-100">
              <Text className="font-bold text-gray-600 text-lg mb-4">
                Leave Overview
              </Text>
              <View className="flex-row justify-around">
                <View className="bg-white p-4 rounded-lg shadow-lg w-2/5">
                  <Text className="text-center text-xl font-bold text-blue-600">
                    {homeData?.leaveTaken}
                  </Text>
                  <Text className="text-center text-gray-500">Leave Taken</Text>
                </View>
                <View className="bg-white p-4 rounded-lg shadow-lg w-2/5">
                  <Text className="text-center text-xl font-bold text-green-600">
                    {Number(homeData?.totalAllottedLeave) -
                      Number(homeData?.leaveTaken)}
                  </Text>
                  <Text className="text-center text-gray-500">
                    Leaves Available
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
