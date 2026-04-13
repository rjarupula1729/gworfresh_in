import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AppContext);

  return (
    <View style={{ flex:1, backgroundColor: colors.light, padding:20 }}>
      
      <Text style={{ fontSize:22, fontWeight:"bold", color:colors.primary }}>
        🌱 GrowFresh
      </Text>

      <Text style={{ marginTop:10 }}>
        Welcome {user?.mobile}
      </Text>

      <Text style={{ marginTop:10 }}>
        🎁 Points: {user?.rewardPoints || 0}
      </Text>

      <Button 
        title="Go to Cart" 
        onPress={() => navigation.navigate("Cart")} 
      />

    </View>
  );
}