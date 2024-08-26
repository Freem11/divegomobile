import { StyleSheet, View, Text, Dimensions, Image, ImageBackground } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function WavyHeader({ customStyles }) {
  return (
    <View style={styles.customStyles}>
      <View style={{ flex: 1,  backgroundColor: "#5000ca",}}>
          <ImageBackground style={styles.backgroundImage} source={require('./png/MonkSeal.png')} />
     <View style={{ flex: 1,  marginTop: windowHeight*-0.75}}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: "absolute", backgroundColor: 'transparent', zIndex: 5 }}
        >
           <Path fill="#ffffff"
            d="M 0,700 L 0,262 C 123.33333333333331,187.60000000000002 246.66666666666663,113.20000000000002 401,132 C 555.3333333333334,150.79999999999998 740.6666666666667,262.8 919,300 C 1097.3333333333333,337.2 1268.6666666666665,299.6 1540,102 L 1440,2200 L 0,2200 Z"
            />
        </Svg>
        </View>
      </View>
      </View>
  );
}


const styles = StyleSheet.create({
  customStyles: {
    flex: 1,
  },
  backgroundImage:{
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth*1.1,
    height: windowHeight/2,
  }
});
