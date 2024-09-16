import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function LeaveScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>This is a Leave page</Text>
      </View>
    </SafeAreaView>
  );
}
