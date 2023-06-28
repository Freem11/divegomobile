import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { getPhotosforAnchor, getPhotosforAnchorMulti } from "../../supabaseCalls/photoSupabaseCalls";
// import { getPhotosforAnchor } from "../../axiosCalls/photoAxiosCalls";
import { SliderContext } from "../contexts/sliderContext";
import { MonthSelectContext } from "../contexts/monthSelectContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalSelectContext } from "../contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { scale } from "react-native-size-matters";
import Lightbox from "react-native-lightbox-v2";
import { FontAwesome } from "@expo/vector-icons";
import email from "react-native-email";

let IPSetter = 2;
let IP;
//Desktop = 10.0.0.253
//Laptop = 10.0.0.68
//Library = 10.44.22.110

if (IPSetter === 1) {
  IP = "10.0.0.253";
} else if (IPSetter === 2) {
  IP = "10.0.0.68";
} else if (IPSetter === 3) {
  IP = "10.44.22.110";
}

let filePath = `/Users/matthewfreeman/divego/wetmap/src/components/uploads/`;

export default function AnchorModal(lat, lng) {
  
  const { sliderVal } = useContext(SliderContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchorPics, setAnchorPics] = useState([]);
  const { monthVal } = useContext(MonthSelectContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        setAnchorPics(photos);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    filterAnchorPhotos();
  }, []);

  const handleEmail = (pic) => {
    const to = ["DiveGo2022@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photoFile} `,
      body:
        "Type of issue: \n \n 1) Animal name not correct \n (Please provide the correct animal name and we will correct the record)\n \n 2)Copy write image claim \n (Please provide proof that you own the submitted photo and we will remove it as you have requested)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const handleEmailDS = () => {
    const to = ["DiveGo2022@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${lat.SiteName}" at Latitude: ${lat.Lat} Longitude: ${lat.Lng} `,
      body:
        "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordiantes are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  return (
    <View style={{ maxHeight: Platform.OS === "android" ? scale(570) : scale(600), marginTop: scale(-10)}}>
      <View style={styles.flagger}>
      {/* <Text
        style={{
          fontFamily: "Caveat_400Regular",
          fontSize: scale(20),
          marginLeft: scale(20),
          marginRight: scale(40),
          color: "#F0EEEB",
        }}
      >
        {monthVal} Sightings
      </Text> */}
      <FontAwesome
        name="flag"
        color="maroon"
        size={20}
        onLongPress={() => handleEmailDS()}
        style={styles.flagMajor}
        />
      </View>
      <ScrollView>
        <View style={styles.container3}>
          {anchorPics &&
            anchorPics.map((pic) => {
              return (
                <View key={pic.id} style={styles.picContainer3}>
                  
                  <View style={styles.micro}>
                    <FontAwesome
                      name="flag"
                      color="maroon"
                      size={20}
                      onLongPress={() => handleEmail(pic)}
                      style={styles.flag}
                    />
                    <Text style={styles.titleText}>{pic.label}</Text>
                  </View>
                  <Lightbox activeProps={{ height: "30%" }}>
                    <View style={styles.shadowbox}>
                      <Image
                        source={{
                          uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${pic.photoFile}`,
                        }}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 15,
                          borderColor: "grey",
                        }}
                      />
                    </View>
                  </Lightbox>
                </View>
              );
            })}
          {anchorPics.length === 0 && (
            <Text style={styles.noSightings}>
              No Sightings At This Site Yet!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container3: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    marginBottom: "20%",
    marginTop: "0%",
    marginRight: scale(10),
    marginLeft: scale(10),
  },
  picContainer3: {
    width: scale(300),
    height: scale(200),
    marginBottom: scale(5),
    backgroundColor: "538bdb"
  },
  shadowbox: {
    // shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
  titleText: {
    textAlign: "center",
    fontFamily: "IndieFlower_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(-10),
  },
  flagMajor:{
    left: scale(40)
  },
  flag: {
    left: scale(257),
    top: scale(2)
  },
  noSightings: {
    width: scale(200),
    alignItems: "center",
    textAlign: "center",
    marginTop: scale(15),
    fontFamily: "IndieFlower_400Regular",
    fontSize: scale(15),
    color: "#F0EEEB",
  },
  micro: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "black",
    opacity: 0.6,
    width: "94%",
    borderRadius: 5,
    zIndex: 2,
    left: 10,
    top: 30
  },
  flagger:{
    flexDirection: "row",
    position: "absolute",
    top: -33,
    left: -15
  }
});
