import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons"; // For icons
import { applyLeave } from "@/actions";
import Toast from "react-native-root-toast";
import { router } from "expo-router";

const Applyleave = () => {
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loadingApiCall , setLoadingApiCall] = useState(false)

  const onSubmit = async (data: any) => {
    setLoadingApiCall(true)
    try {
      const requestData = {
        leaveType: "casual",
        startDate: startDate,
        endDate: endDate,
        reason: data.reason,
      };

      const response = await applyLeave(requestData);
      Toast.show("Leave Applied ");
      reset()
      router.replace("/(tabs)/leave")
    } catch (error: any) {
      Toast.show(error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }finally{
      setLoadingApiCall(false)
    }
  };

  // Handlers for Date Picker
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Text className="text-xl font-bold text-center mb-4">
          Apply for Leave
        </Text>

        {/* Start Date Picker */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white flex-row justify-between items-center"
          >
            <Text>{startDate.toISOString().split("T")[0]}</Text>
            <FontAwesome name="calendar" size={20} color="gray" />
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </View>

        {/* End Date Picker */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">End Date</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white flex-row justify-between items-center"
          >
            <Text>{endDate.toISOString().split("T")[0]}</Text>
            <FontAwesome name="calendar" size={20} color="gray" />
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}
        </View>

        {/* Reason Input */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">Reason</Text>
          <Controller
            control={control}
            name="reason"
            defaultValue=""
            rules={{
              required: "Reason is required",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  className="border p-2 mt-2 rounded-md border-gray-300 bg-white"
                  placeholder="Reason for leave"
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className={`p-3 rounded-md ${
            (!formState.isValid || loadingApiCall) ? "bg-gray-400" : "bg-purple-600"
          }`}
          disabled={!formState.isValid || loadingApiCall}
        >
          <Text className="text-center text-white font-bold">
            {loadingApiCall ? "Submitting..." : "Submit Leave Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Applyleave;
