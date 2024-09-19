import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, StatusBar, View } from "react-native";
import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center p-5 items-center rounded-full ${
      focused ? "bg-white" : ""
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? " bg-white" : ""
      }`}
    >
      <Image
        source={source}
        tintColor={focused ? "purple" : "black"}
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <>
      <StatusBar
        barStyle="light-content" // Options: 'default', 'light-content', 'dark-content'
        // backgroundColor="#333333" // Background color for Android
        translucent={true}
      />
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: "white",
          // tabBarInactiveTintColor: "white",
          tabBarShowLabel: false,
          tabBarStyle: {
            // backgroundColor: "#333333",
            // borderRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: 0,
            overflow: "hidden",
            marginHorizontal: 0,
            marginBottom: 0,
            height: 78,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.home} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="leave"
          options={{
            title: "Request Details",
            headerShown: true,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.list} focused={focused} />
            ),
            headerStyle: {
              backgroundColor: "purple",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerTintColor: "purple",
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.person} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
