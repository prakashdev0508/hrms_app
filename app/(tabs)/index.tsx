import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>This is a Home page</Text>
      </View>
    </SafeAreaView>
  );
}
