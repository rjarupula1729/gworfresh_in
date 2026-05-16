import React, { useState, useContext, useEffect } from "react";import React, { useState, useContext } from "react";

import {import {

  View,  View,

  Text,  Text,

  TextInput,  TextInput,

  TouchableOpacity,  TouchableOpacity,

  ActivityIndicator,  ActivityIndicator,

  StyleSheet,  StyleSheet,

  Alert,  Alert,

  KeyboardAvoidingView,  KeyboardAvoidingView,

  Platform,  Platform,

  ScrollView,  ScrollView

} from "react-native";} from "react-native";

import { LinearGradient } from "expo-linear-gradient";import API from "../services/api";

import API from "../services/api";import { AppContext } from "../context/AppContext";

import { AppContext } from "../context/AppContext";import colors from "../utils/colors";

import { COLORS, GRADIENTS } from "../utils/colors";

import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";export default function LoginScreen() {

  const [mobile, setMobile] = useState("");

export default function LoginScreen() {  const [otp, setOtp] = useState("");

  const [mobile, setMobile] = useState("");  const [step, setStep] = useState("mobile"); // "mobile" or "otp"

  const [otp, setOtp] = useState("");  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("mobile");  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);  const { login } = useContext(AppContext);



  const { login } = useContext(AppContext);  // Request OTP

  const handleRequestOTP = async () => {

  const handleRequestOTP = async () => {    if (!mobile || mobile.length < 10) {

    if (!mobile || mobile.length < 10) {      Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");

      Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");      return;

      return;    }

    }

    setLoading(true);    setLoading(true);

    try {    try {

      Alert.alert("OTP Sent", "Demo OTP: 1234");      // In production, this would send OTP to the user's phone

      setStep("otp");      // For demo, we're just moving to OTP screen

      setTimer(120);      Alert.alert("OTP Sent", "Demo OTP: 1234");

    } catch (err) {      setStep("otp");

      Alert.alert("Error", err.response?.data?.msg || "Failed to send OTP");      setTimer(120); // 2 minutes timer

    } finally {    } catch (err) {

      setLoading(false);      Alert.alert("Error", err.response?.data?.msg || "Failed to send OTP");

    }    } finally {

  };      setLoading(false);

    }

  const handleVerifyOTP = async () => {  };

    if (!otp || otp.length !== 4) {

      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP");  // Verify OTP and Login

      return;  const handleVerifyOTP = async () => {

    }    if (!otp || otp.length !== 4) {

    setLoading(true);      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP");

    try {      return;

      const res = await API.post("/auth/verify-otp", { mobile, otp });    }

      login(res.data.user, res.data.token);

    } catch (err) {    setLoading(true);

      Alert.alert("Login Failed", err.response?.data?.msg || "Invalid OTP");    try {

    } finally {      const res = await API.post("/auth/verify-otp", {

      setLoading(false);        mobile,

    }        otp

  };      });



  useEffect(() => {      login(res.data.user, res.data.token);

    if (timer > 0) {      Alert.alert("Success", "Logged in successfully!");

      const i = setInterval(() => setTimer((t) => t - 1), 1000);    } catch (err) {

      return () => clearInterval(i);      Alert.alert("Login Failed", err.response?.data?.msg || "Invalid OTP");

    }    } finally {

  }, [timer]);      setLoading(false);

    }

  return (  };

    <LinearGradient colors={GRADIENTS.primary} style={styles.root}>

      <KeyboardAvoidingView  // Timer countdown for OTP

        behavior={Platform.OS === "ios" ? "padding" : "height"}  React.useEffect(() => {

        style={{ flex: 1 }}    if (timer > 0) {

      >      const interval = setInterval(() => setTimer(timer - 1), 1000);

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">      return () => clearInterval(interval);

          {/* Hero */}    }

          <View style={styles.hero}>  }, [timer]);

            <Text style={styles.logo}>🌱</Text>

            <Text style={styles.brand}>GrowFresh</Text>  return (

            <Text style={styles.tagline}>Grow your own. Live well.</Text>    <KeyboardAvoidingView

          </View>      behavior={Platform.OS === "ios" ? "padding" : "height"}

      style={styles.container}

          {/* Card */}    >

          <View style={styles.card}>      <ScrollView contentContainerStyle={styles.scrollContent}>

            {step === "mobile" ? (        <View style={styles.headerContainer}>

              <>          <Text style={styles.appTitle}>🌱 GrowFresh</Text>

                <Text style={styles.title}>Welcome</Text>          <Text style={styles.tagline}>Grow your own vegetables at home</Text>

                <Text style={styles.desc}>Enter your mobile to get an OTP</Text>        </View>



                <View style={styles.inputWrap}>        {step === "mobile" ? (

                  <Text style={styles.prefix}>+91</Text>          <View style={styles.formContainer}>

                  <TextInput            <Text style={styles.stepTitle}>Enter Your Mobile Number</Text>

                    style={styles.input}            <Text style={styles.description}>

                    placeholder="98765 43210"              We'll send you an OTP to verify your account

                    placeholderTextColor={COLORS.muted}            </Text>

                    keyboardType="phone-pad"

                    value={mobile}            <TextInput

                    onChangeText={setMobile}              style={styles.input}

                    editable={!loading}              placeholder="+91 98765 43210"

                    maxLength={10}              placeholderTextColor="#999"

                  />              keyboardType="phone-pad"

                </View>              value={mobile}

              onChangeText={setMobile}

                <PrimaryButton              editable={!loading}

                  label="Request OTP"            />

                  loading={loading}

                  onPress={handleRequestOTP}            <TouchableOpacity

                />              style={[

              </>                styles.button,

            ) : (                loading && styles.buttonDisabled

              <>              ]}

                <Text style={styles.title}>Verify OTP</Text>              onPress={handleRequestOTP}

                <Text style={styles.desc}>Sent to +91 {mobile}</Text>              disabled={loading}

            >

                <TextInput              {loading ? (

                  style={[styles.input, styles.otpInput]}                <ActivityIndicator color={colors.white} />

                  placeholder="0000"              ) : (

                  placeholderTextColor={COLORS.muted}                <Text style={styles.buttonText}>Request OTP</Text>

                  keyboardType="number-pad"              )}

                  value={otp}            </TouchableOpacity>

                  onChangeText={setOtp}          </View>

                  maxLength={4}        ) : (

                  editable={!loading}          <View style={styles.formContainer}>

                />            <Text style={styles.stepTitle}>Enter OTP</Text>

            <Text style={styles.description}>

                {timer > 0 ? (              OTP sent to {mobile}

                  <Text style={styles.timer}>OTP expires in {timer}s</Text>            </Text>

                ) : (

                  <TouchableOpacity onPress={handleRequestOTP}>            <TextInput

                    <Text style={styles.linkBold}>Resend OTP</Text>              style={styles.input}

                  </TouchableOpacity>              placeholder="0000"

                )}              placeholderTextColor="#999"

              keyboardType="number-pad"

                <PrimaryButton              value={otp}

                  label="Verify & Login"              onChangeText={setOtp}

                  loading={loading}              maxLength={4}

                  onPress={handleVerifyOTP}              editable={!loading}

                />              textAlign="center"

            />

                <TouchableOpacity onPress={() => setStep("mobile")} style={{ marginTop: SPACING.sm }}>

                  <Text style={styles.link}>Change mobile number</Text>            {timer > 0 && (

                </TouchableOpacity>              <Text style={styles.timerText}>OTP expires in {timer}s</Text>

              </>            )}

            )}

          </View>            <TouchableOpacity

              style={[

          <Text style={styles.demoText}>Demo Mobile: Any 10 digits · OTP: 1234</Text>                styles.button,

        </ScrollView>                loading && styles.buttonDisabled

      </KeyboardAvoidingView>              ]}

    </LinearGradient>              onPress={handleVerifyOTP}

  );              disabled={loading}

}            >

              {loading ? (

function PrimaryButton({ label, loading, onPress }) {                <ActivityIndicator color={colors.white} />

  return (              ) : (

    <TouchableOpacity                <Text style={styles.buttonText}>Verify & Login</Text>

      activeOpacity={0.85}              )}

      onPress={onPress}            </TouchableOpacity>

      disabled={loading}

      style={{ marginTop: SPACING.md }}            <TouchableOpacity onPress={() => setStep("mobile")}>

    >              <Text style={styles.linkText}>Change mobile number</Text>

      <LinearGradient            </TouchableOpacity>

        colors={loading ? [COLORS.muted, COLORS.muted] : GRADIENTS.fresh}          </View>

        start={{ x: 0, y: 0 }}        )}

        end={{ x: 1, y: 1 }}

        style={styles.btn}        <Text style={styles.demoText}>

      >          Demo Mobile: Any number | Demo OTP: 1234

        {loading ? (        </Text>

          <ActivityIndicator color={COLORS.white} />      </ScrollView>

        ) : (    </KeyboardAvoidingView>

          <Text style={styles.btnText}>{label}</Text>  );

        )}}

      </LinearGradient>

    </TouchableOpacity>const styles = StyleSheet.create({

  );  container: {

}    flex: 1,

    backgroundColor: colors.light

const styles = StyleSheet.create({  },

  root: { flex: 1 },  scrollContent: {

  scroll: {    flexGrow: 1,

    flexGrow: 1,    justifyContent: "center",

    justifyContent: "center",    paddingHorizontal: 20

    paddingHorizontal: SPACING.lg,  },

    paddingVertical: SPACING.xxl,  headerContainer: {

  },    alignItems: "center",

  hero: {    marginBottom: 40

    alignItems: "center",  },

    marginBottom: SPACING.xl,  appTitle: {

  },    fontSize: 36,

  logo: { fontSize: 56, marginBottom: 4 },    fontWeight: "bold",

  brand: {    color: colors.primary,

    fontSize: 34,    marginBottom: 8

    fontWeight: "900",  },

    color: COLORS.white,  tagline: {

    letterSpacing: 0.5,    fontSize: 14,

    textShadowColor: "rgba(0,0,0,0.25)",    color: "#666",

    textShadowOffset: { width: 0, height: 2 },    textAlign: "center"

    textShadowRadius: 4,  },

  },  formContainer: {

  tagline: {    backgroundColor: colors.white,

    fontSize: 13,    borderRadius: 12,

    color: "rgba(255,255,255,0.9)",    padding: 24,

    marginTop: 4,    marginBottom: 20

    fontWeight: "600",  },

  },  stepTitle: {

  card: {    fontSize: 18,

    backgroundColor: COLORS.white,    fontWeight: "600",

    borderRadius: RADIUS.md,    color: colors.text,

    padding: SPACING.xl,    marginBottom: 8

    ...SHADOWS.md,  },

  },  description: {

  title: {    fontSize: 13,

    ...TYPE.title,    color: "#666",

    color: COLORS.text,    marginBottom: 20

    marginBottom: 4,  },

  },  input: {

  desc: {    borderWidth: 1,

    ...TYPE.caption,    borderColor: "#DDD",

    color: COLORS.muted,    borderRadius: 8,

    marginBottom: SPACING.lg,    padding: 12,

  },    fontSize: 16,

  inputWrap: {    marginBottom: 16,

    flexDirection: "row",    color: colors.text

    alignItems: "center",  },

    borderWidth: 1.5,  button: {

    borderColor: COLORS.greenPale,    backgroundColor: colors.primary,

    borderRadius: RADIUS.sm,    borderRadius: 8,

    paddingHorizontal: SPACING.md,    padding: 14,

    backgroundColor: COLORS.bg,    alignItems: "center",

  },    marginBottom: 12

  prefix: {  },

    fontSize: 16,  buttonDisabled: {

    fontWeight: "700",    opacity: 0.6

    color: COLORS.green,  },

    marginRight: 8,  buttonText: {

  },    color: colors.white,

  input: {    fontSize: 16,

    flex: 1,    fontWeight: "600"

    paddingVertical: 12,  },

    fontSize: 16,  timerText: {

    color: COLORS.text,    textAlign: "center",

  },    color: "#FF6B6B",

  otpInput: {    fontSize: 12,

    borderWidth: 1.5,    marginBottom: 12

    borderColor: COLORS.greenPale,  },

    borderRadius: RADIUS.sm,  linkText: {

    paddingHorizontal: SPACING.md,    textAlign: "center",

    backgroundColor: COLORS.bg,    color: colors.primary,

    textAlign: "center",    fontSize: 14,

    fontSize: 24,    fontWeight: "500",

    fontWeight: "800",    marginTop: 12

    letterSpacing: 8,  },

  },  demoText: {

  btn: {    textAlign: "center",

    borderRadius: RADIUS.sm,    color: "#999",

    paddingVertical: 14,    fontSize: 11,

    alignItems: "center",    fontStyle: "italic"

  },  }

  btnText: {});

    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  timer: {
    textAlign: "center",
    color: COLORS.orangeDeep,
    fontSize: 12,
    marginTop: SPACING.sm,
    fontWeight: "700",
  },
  link: {
    textAlign: "center",
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
  },
  linkBold: {
    textAlign: "center",
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
    marginTop: SPACING.sm,
  },
  demoText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    marginTop: SPACING.lg,
    fontStyle: "italic",
  },
});
