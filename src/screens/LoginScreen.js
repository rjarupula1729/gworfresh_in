import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const { login } = useContext(AppContext);

  // Request OTP
  const handleRequestOTP = async () => {
    if (!mobile || mobile.length < 10) {
      Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      // In production, this would send OTP to the user's phone
      // For demo, we're just moving to OTP screen
      Alert.alert("OTP Sent", "Demo OTP: 1234");
      setStep("otp");
      setTimer(120); // 2 minutes timer
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Login
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", {
        mobile,
        otp
      });

      login(res.data.user, res.data.token);
      Alert.alert("Success", "Logged in successfully!");
    } catch (err) {
      Alert.alert("Login Failed", err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown for OTP
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.appTitle}>🌱 GrowFresh</Text>
          <Text style={styles.tagline}>Grow your own vegetables at home</Text>
        </View>

        {step === "mobile" ? (
          <View style={styles.formContainer}>
            <Text style={styles.stepTitle}>Enter Your Mobile Number</Text>
            <Text style={styles.description}>
              We'll send you an OTP to verify your account
            </Text>

            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled
              ]}
              onPress={handleRequestOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Request OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.stepTitle}>Enter OTP</Text>
            <Text style={styles.description}>
              OTP sent to {mobile}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="0000"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
              editable={!loading}
              textAlign="center"
            />

            {timer > 0 && (
              <Text style={styles.timerText}>OTP expires in {timer}s</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled
              ]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep("mobile")}>
              <Text style={styles.linkText}>Change mobile number</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.demoText}>
          Demo Mobile: Any number | Demo OTP: 1234
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center"
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 12
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600"
  },
  timerText: {
    textAlign: "center",
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 12
  },
  linkText: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12
  },
  demoText: {
    textAlign: "center",
    color: "#999",
    fontSize: 11,
    fontStyle: "italic"
  }
});
