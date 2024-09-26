import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="applyleave"
        options={{
          title: " Apply leave ",
          headerShown: true,
          headerStyle: {
            backgroundColor: "purple",
            
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="applyregularisation"
        options={{
            title: " Apply Regularization ",
            headerShown: true,
            headerStyle: {
              backgroundColor: "purple",
              
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerTintColor: "white",
          }}
      />
    </Stack>
  );
};

export default Layout;
