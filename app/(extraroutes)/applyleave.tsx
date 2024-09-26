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

const Applyleave = () => {
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange", // Enable re-validation on each input change
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onSubmit = async (data: any) => {
    console.log({ ...data, startDate, endDate });
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
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white"
          >
            <Text>{startDate.toISOString().split("T")[0]}</Text>
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
            className="border p-2 mt-2 rounded-md border-gray-300 bg-white"
          >
            <Text>{endDate.toISOString().split("T")[0]}</Text>
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
                  onChangeText={(text) => onChange(text.trim())}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {error && (
                  <Text className="text-red-500 text-sm">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className={`p-3 rounded-md ${
            formState.isValid ? "bg-purple-600" : "bg-gray-400"
          }`}
          disabled={!formState.isValid} // Disable the button if form is invalid
        >
          <Text className="text-center text-white font-bold">
            Submit Leave Request
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Applyleave;
