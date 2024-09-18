import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { getRequestList } from "@/actions";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  useEffect(() => {
    fetchData();
  }, []);

  const renderLeaveItem = ({ item }: any) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
      <Text>Leave Type: {item.leaveType}</Text>
      <Text>Start Date: {new Date(item.startDate).toDateString()}</Text>
      <Text>End Date: {new Date(item.endDate).toDateString()}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Reason: {item.reason}</Text>
      <Text>Approved By: {item.approvedBy?.name || "N/A"}</Text>
    </View>
  );

  const renderRegularizationItem = ({ item }: any) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
      <Text>Date: {new Date(item.date).toDateString()}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Check-In Time: {new Date(item.checkInTime).toLocaleTimeString()}</Text>
      <Text>Check-Out Time: {new Date(item.checkOutTime).toLocaleTimeString()}</Text>
      <Text>Reason: {item.regularizationReason}</Text>
    </View>
  );

  const LeaveRequestsRoute = () => (
    <FlatList
      data={[
        ...(requestData?.leavesApproved || []),
        ...(requestData?.leavesRejected || []),
        ...(requestData?.leavesPending || [])
      ]|| []}
      renderItem={renderLeaveItem}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No leave requests available</Text>}
    />
  );

  const RegularizationsRoute = () => (
    <FlatList
      data={[
        ...(requestData?.regularizationsApproved || []),
        ...(requestData?.regularizationsPending || []),
        ...(requestData?.regularizationsRejected || [])
      ] || []}
      renderItem={renderRegularizationItem}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No regularizations available</Text>}
    />
  );

  const renderScene = SceneMap({
    leaveRequests: LeaveRequestsRoute,
    regularizations: RegularizationsRoute,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading...</Text>
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
    </SafeAreaView>
  );
}
