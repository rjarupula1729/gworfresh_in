import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button } from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";

export default function GardenScreen() {
  const [plants, setPlants] = useState([]);
  const { token } = useContext(AppContext);

  const fetchPlants = async () => {
    const res = await API.get("/garden", {
      headers: { Authorization: token }
    });
    setPlants(res.data);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const addPlant = async () => {
    await API.post("/garden", {
      type: "Tomato",
      daysPlanted: 1,
      totalDays: 60
    }, {
      headers: { Authorization: token }
    });

    fetchPlants();
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Tomato Plant" onPress={addPlant} />
      {plants.map((p, i) => (
        <Text key={i}>{p.type} - Day {p.daysPlanted}</Text>
      ))}
    </View>
  );
}