import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ShopScreen from "../screens/ShopScreen";
import CartScreen from "../screens/CartScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import PlantTrackingScreen from "../screens/PlantTrackingScreen";
import CommunityForumScreen from "../screens/CommunityForumScreen";
import InstructorBookingScreen from "../screens/InstructorBookingScreen";

import { AppContext } from "../context/AppContext";
import { COLORS } from "../utils/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Shop") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "box" : "box-outline";
          } else if (route.name === "Garden") {
            iconName = focused ? "leaf" : "leaf-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Instructors") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen}
        options={{ title: "Shop" }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderTrackingScreen}
        options={{ title: "Orders" }}
      />
      <Tab.Screen 
        name="Garden" 
        component={PlantTrackingScreen}
        options={{ title: "Garden" }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityForumScreen}
        options={{ title: "Community" }}
      />
      <Tab.Screen 
        name="Instructors" 
        component={InstructorBookingScreen}
        options={{ title: "Experts" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, loading } = useContext(AppContext);

  // ADD THIS LOADER FIX HERE
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen name="Cart" component={CartScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}