import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import WeatherInfo from "./components/WeatherInfo";
import UnitsPicker from "./components/UnitsPicker";
import ReloadIcon from "./components/ReloadIcon";
import WeatherDetails from "./components/WeatherDetails";
import { colors } from "./utils/index";
import { WEATHER_API_KEY } from "@env";

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [errorMessage, seterrorMessage] = useState(null);
  const [currentWeather, setcurrentWeather] = useState(null);
  const [unitsSystem, setunitsSystem] = useState("metric");

  useEffect(() => {
    load();
  }, [unitsSystem]);

  async function load() {
    setcurrentWeather(null);
    seterrorMessage(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        seterrorMessage("Access to location is required!");
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl);
      const result = await response.json();

      if (response.ok) {
        setcurrentWeather(result);
      } else {
        seterrorMessage(result.message);
      }
    } catch (error) {
      seterrorMessage(error.message);
    }
  }

  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker
            unitsSystem={unitsSystem}
            setunitsSystem={setunitsSystem}
          />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails
          currentWeather={currentWeather}
          unitsSystem={unitsSystem}
        />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <ReloadIcon load={load} />
        <Text style={{ textAlign: "center" }}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
});
