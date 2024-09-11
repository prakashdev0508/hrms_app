import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const RootLayout = () => {
  return (
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }}  />
        <Stack.Screen name='(auth)' options={{ headerShown: false }}  />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }}  />
        <Stack.Screen name='+not-found'  />

      </Stack>
  );
}

const styles = StyleSheet.create({})

export default RootLayout;
