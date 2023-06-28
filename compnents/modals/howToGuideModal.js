import { StyleSheet, Text, View, ScrollView } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function GuideModal() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.topSec}>
          <Text style={styles.textSt}>
            Welcome to DiveGo, this app is designed for divers who love to
            interact with animals
          </Text>
          <Text style={styles.textSt}>
            The anchor icons show you the locations of dive
            sites and heat map dots show you where animals have been 
            spotted there in the past. Heat dot intensity
            increasing with the more sightings in that location.
          </Text>
          <Text style={styles.textSt}>
            Tapping on an Anchor Icon will do one of two things. For grey icons 
            this represents a cluster of dive sites and will zoom in until the cluster will break apart.
            For the blue icons this is a dive site, a menu will pop up and show you all photos taken of creatures 
            at that site.
          </Text>
          <Text style={styles.textSt}>
            To see where specific creatures are pan the pictures carrousel at the top 
            and click on whichever you like. (one or multiple are possible) Please note 
            the photos do change based on where you have the map placed, and will update to 
            show you creatures available in that area.
          </Text>
          <Text style={styles.textSt}>
            As you select sea creature the heatmap will update to show you roughly where the sea 
            creatures have been spotted (around a dive site normally). Additionally, there is a chart 
            at the bottom that appears and shows you in what month these sea creatues were spotted in 
            these locations.
          </Text>
          <Text style={styles.textSt}>
            Add your own dive sites and sea creature sitghting photos to help improve the app!
          </Text>
        </View>

        <View style={styles.bottomSec}>
          <View style={styles.explore}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "0%",
                height: "100%",
                marginRight: 5,
              }}
            >
              <MaterialIcons name="explore" color="gold" size={24} />
            </View>

            <Text style={styles.blurb}>
              Click this icon to change the map to another location, type in the
              name of the city or town closest to where you want to search, hit
              enter and it will take you there.
            </Text>
          </View>

          <View style={styles.camera}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginRight: 5,
              }}
            >
              <MaterialIcons name="photo-camera" color="gold" size={24} />
            </View>

            <Text style={styles.blurb}>
              Click this icon to toggle the photo uploader window, in this
              window you can upload photos of the animals you have seen, the
              system will take the date the photo was taken as well as the GPS
              coordinates, if they are part of the photo, if not click the pin
              icon to the right of the fields to open another map page to drop a
              pin. Doing so will generate a set of GPS cooridnates for your
              photo.
            </Text>
          </View>

          <View style={styles.pinDrop}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginRight: 5,
              }}
            >
              <MaterialIcons
                name="add-location-alt"
                color="gold"
                size={24}
              />
            </View>

            <Text style={styles.blurb}>
              Click this icon to toggle the add dive site window, in this window
              you can upload a photo from your dive site and it will pull the
              GPS coordinates, all you need to do is add the site name, and if
              you dont have a photo please drop your lat and lng coordianted in
              fields.
            </Text>
          </View>

          <View style={styles.search}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginRight: 5,
              }}
            >
              <MaterialCommunityIcons
                name="map-search-outline"
                color="gold"
                size={24}
              />
            </View>

            <Text style={styles.blurb}>
              Click this icon to open the dive site search tool, the list of dive sites is limited to the area of the map you have on screen,
               moving the map will change the dive site list,
               start typing the name of the dive site you are looking for and the autocomplete will filter to your site,
               Select a dive site of your choice and the map will pan and zoom the the dive site and temporarily place yellow icon to indicate which site you have selected
               The yellow icon is to help find your specific site in more congested diving areas  
            </Text>
          </View>

          <View style={styles.anchor}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                marginRight: 5,
              }}
            >
              <MaterialIcons name="anchor" color="gold" size={24} />
            </View>

            <Text style={styles.blurb}>
              Click this icon to toggle the dive site anchors on and off, this
              will allow you to see the heat dots more easily when needed.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "30%",
    marginTop: "5%",
    marginRight: 10,
    marginLeft: 10,
  },
  textSt: {
    fontFamily: "IndieFlower_400Regular",
    marginBottom: 10,
    color: "#F0EEEB",
  },
  topSec: {
    flex: 1,
    width: "92%",
    flexDirection: "column",
    marginRight: 0,
    marginLeft: 10,
  },
  bottomSec: {
    flex: 1,
    flexDirection: "column",
    marginTop: 30,
    marginRight: 40,
    marginLeft: 0,
  },
  leftSide: {
    marginRight: 10,
    marginTop: 10,
  },
  blurb: {
    fontFamily: "IndieFlower_400Regular",
    height: "100%",
    width: "80%",
    color: "#F0EEEB",
  },
  explore: {
    marginTop: "0%",
    width: "100%",
    flexDirection: "row",
    maxHeight: 150,
  },
  camera: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    maxHeight: 300,
  },
  pinDrop: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    maxHeight: 200,
  },
  search: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    maxHeight: 400,
  },
  anchor: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    maxHeight: 150,
  },
});
