import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function TabTwoScreen() {
  const { onLogout } = useAuth();

  const handleCheckOut = () => {
    onLogout();
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg"
          onPress={handleCheckOut}
        >
          <Text className="text-center text-white font-bold text-lg">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
