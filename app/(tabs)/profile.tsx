import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function TabTwoScreen() {
  const { onLogout } = useAuth();

  return (
    <SafeAreaView>
      <View>
        
      </View>
    </SafeAreaView>
  );
}
