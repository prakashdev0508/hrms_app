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
import { FontAwesome } from "@expo/vector-icons";
import { applyRegularization } from "@/actions"; 
import Toast from "react-native-root-toast";
import { router } from "expo-router";

const ApplyRegularization = () => {
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
  });
  const [date, setDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [loadingApiCall, setLoadingApiCall] = useState(false);

  const onSubmit = async (data: any) => {
    setLoadingApiCall(true);
    try {
      const requestData = {
        date: date.toISOString().split("T")[0], // Format date
        reason: data.reason,
        checkInTime: checkInTime.toISOString(),
        checkOutTime: checkOutTime.toISOString(),
      };

      const response = await applyRegularization(requestData);
      Toast.show("Regularization Applied");
      reset();
      router.replace("/(tabs)/leave"); // Redirect to leave tab
    } catch (error: any) {
      Toast.show(error?.response?.data?.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } finally {
      setLoadingApiCall(false);
    }
  };

  // Handlers for Date Picker
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onCheckInTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || checkInTime;
    setShowCheckInPicker(Platform.OS === "ios");
    setCheckInTime(currentDate);
  };

  const onCheckOutTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || checkOutTime;
    setShowCheckOutPicker(Platform.OS === "ios");
    setCheckOutTime(currentDate);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Text className="text-xl font-bold text-center mb-4">
          Apply for Regularization
        </Text>

        {/* Date Picker */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white flex-row justify-between items-center"
          >
            <Text>{date.toISOString().split("T")[0]}</Text>
            <FontAwesome name="calendar" size={20} color="gray" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Check-In Time Picker */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">Check-In Time</Text>
          <TouchableOpacity
            onPress={() => setShowCheckInPicker(true)}
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white flex-row justify-between items-center"
          >
            <Text>{checkInTime.toISOString().split("T")[1].split(".")[0]}</Text>
            <FontAwesome name="clock-o" size={20} color="gray" />
          </TouchableOpacity>
          {showCheckInPicker && (
            <DateTimePicker
              value={checkInTime}
              mode="time"
              display="default"
              onChange={onCheckInTimeChange}
            />
          )}
        </View>

        {/* Check-Out Time Picker */}
        <View className="mb-4">
          <Text className="text-base text-gray-700">Check-Out Time</Text>
          <TouchableOpacity
            onPress={() => setShowCheckOutPicker(true)}
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white flex-row justify-between items-center"
          >
            <Text>{checkOutTime.toISOString().split("T")[1].split(".")[0]}</Text>
            <FontAwesome name="clock-o" size={20} color="gray" />
          </TouchableOpacity>
          {showCheckOutPicker && (
            <DateTimePicker
              value={checkOutTime}
              mode="time"
              display="default"
              onChange={onCheckOutTimeChange}
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
                  placeholder="Reason for regularization"
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {error && <Text className="text-red-500">{error.message}</Text>}
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
            {loadingApiCall ? "Submitting..." : "Submit Regularization Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplyRegularization;
