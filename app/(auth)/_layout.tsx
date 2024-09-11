import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const RootLayout = () => {
    const token = "dkfjkdfbjkd"

    useEffect(()=>{
    })

  return (
      <Stack>
        <Stack.Screen name='Login' options={{ headerShown : false }}  />
      </Stack>
  );
}

const styles = StyleSheet.create({})

export default RootLayout;
