import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { getRequestList } from "@/actions";
import { useWindowDimensions } from "react-native";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native"; 

export default function LeaveScreen() {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "leaveRequests", title: "Leave Requests" },
    { key: "regularizations", title: "Regularizations" },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequestList();
      setRequestData(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const renderLeaveItem = ({ item }: any) => (
    <View style={styles.card}>
      <View className="flex-row justify-between">
        <View className="flex-row mb-1 ">
          <Text className="font-JakartaBold">{moment(item?.startDate).format("D MMM YYYY")}</Text>
          <Text className="mx-1">--</Text>
          <Text className="font-JakartaBold">{moment(item?.endDate).format("D MMM YYYY")}</Text>
        </View>
        <Text 
          className={`px-2 py-1 rounded-md text-xs font-JakartaSemiBold uppercase flex-row`}
        >
          <View
            className={`${
              item?.status === "approved"
                ? "bg-green-500"
                : item?.status === "pending"
                ? "bg-yellow-500"
                : item?.status === "rejected"
                ? "bg-red-500"
                : "bg-gray-400"
            } h-[9px] mr-3 w-[9px] justify-center rounded-full`}
          ></View>
          {item?.status}
        </Text>
      </View>
      <Text style={styles.subText}>{item?.reason}</Text>
      <Text>{moment(item?.appliedDate).format("D MMM YYYY")}</Text>
    </View>
  );

  const renderRegularizationItem = ({ item }: any) => (
    <View style={styles.card}>
      <View className="flex-row justify-between">
        <Text className="font-JakartaSemiBold mb-3">
          {moment(item?.date).format("D MMM YYYY")}
        </Text>
        <Text className={`px-2 py-1 rounded-md text-xs font-JakartaSemiBold uppercase flex-row`}>
          <View
            className={`${
              item?.regularizeRequest === "approved"
                ? "bg-green-500"
                : item?.regularizeRequest === "pending"
                ? "bg-yellow-500"
                : item?.regularizeRequest === "rejected"
                ? "bg-red-500"
                : "bg-gray-400"
            } h-[9px] mr-4 w-[9px] justify-center rounded-full`}
          ></View>
          {item?.regularizeRequest}
        </Text>
      </View>
      <View className="flex-row mb-1 ">
        <Text className="font-JakartaMedium text-sm">Check-In </Text>
        <Text className="mx-1">--</Text>
        <Text className="font-JakartaMedium text-sm">{moment(item?.checkInTime).format("HH:mm")}</Text>
      </View>
      <View className="flex-row mb-1 ">
        <Text className="font-JakartaMedium text-sm">Check Out</Text>
        <Text className="mx-1">--</Text>
        <Text className="font-JakartaMedium text-sm">{moment(item?.checkOutTime).format("HH:mm")}</Text>
      </View>
    </View>
  );

  const LeaveRequestsRoute = () => (
    <View className="mb-20">
      <FlatList
        data={[
          ...(requestData?.leavesPending || []),
          ...(requestData?.leavesApproved || []),
          ...(requestData?.leavesRejected || []),
        ]}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No leave requests available</Text>}
      />
    </View>
  );

  const RegularizationsRoute = () => (
    <View className="mb-20">
      <FlatList
        data={[
          ...(requestData?.regularizationsPending || []),
          ...(requestData?.regularizationsApproved || []),
          ...(requestData?.regularizationsRejected || []),
        ]}
        renderItem={renderRegularizationItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No regularizations available</Text>}
      />
    </View>
  );

  const renderScene = SceneMap({
    leaveRequests: LeaveRequestsRoute,
    regularizations: RegularizationsRoute,
  });

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="flex-row justify-center align-middle min-h-screen"
        />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "blue" }}
              style={{ backgroundColor: "white" }}
              labelStyle={{ color: "black" }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
});
