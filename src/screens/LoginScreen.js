import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const { login } = useContext(AppContext);

  const handleLogin = async () => {
    const res = await API.post("/auth/verify-otp", {
      mobile,
      otp
    });

    login(res.data.user, res.data.token);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput placeholder="Mobile" onChangeText={setMobile} />
      <TextInput placeholder="OTP (1234)" onChangeText={setOtp} />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}