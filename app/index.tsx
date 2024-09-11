import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'

const index = () => {
  const  isSignedIn  = false

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/"} />
  }

  return <Redirect href="/(auth)/Login" />;
}

export default index