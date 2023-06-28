import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from "react-native-size-matters";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import { getHistoData } from "../../supabaseCalls/photoSupabaseCalls";
import AxisBar from "./histogramAxis";
import DataBar from "./histogramBar";

export default function Historgram() {
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { boundaries } = useContext(MapBoundariesContext);
  const [histoData, setHistoData] = useState([]);

  useEffect(() => {
    getHistogramData();
  }, []);

  useEffect(() => {
    getHistogramData();
  }, [animalMultiSelection, boundaries]);

  const getHistogramData = async () => {

    if (boundaries.length !== 0){
      try {
        const historgramData = await getHistoData({
          animals: animalMultiSelection,
          minLat: boundaries[1],
          maxLat: boundaries[3],
          minLng: boundaries[0],
          maxLng: boundaries[2],
        });
  
        let i = 1;
        let dataArray = [];
        let maxVal;
        for (i = 1; i < 13; i++) {
          historgramData.forEach((dataPoint) => {
            if (dataPoint.month === i) {
              dataArray.push(dataPoint.num);
            }
          });
          if (dataArray.length < i) {
            dataArray.push(0);
          }
        }
        maxVal = dataArray.reduce((a, b) => Math.max(a, b), -Infinity);
        if (maxVal === 0) {
          percentArr = dataArray;
        } else {
          percentArr = dataArray.map((val) => (val / maxVal) * 100);
        }
        setHistoData(percentArr);
  
      } catch (e) {
        console.log({ title: "Error", message: e.message });
      }
    }
    
  };

  return (
    <View style={styles.container} pointerEvents={'none'}>
      <View style={styles.barBox} pointerEvents={'none'}>
        {histoData.length > 0 &&
          histoData.map((moddedVal, index) => {
            return <DataBar key={index} moddedVal={moddedVal} />;
          })}
      </View>
      <AxisBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 2,
    height: 40,
    borderRadius: scale(10),
    width: "100%",
  },
  barBox: {
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "space-evenly",
    verticalAlign: "bottom",
    height: "70%",
    width: "90%",
    marginLeft: scale(10),
    marginTop: 10,
  }
});
