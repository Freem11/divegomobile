import { StyleSheet, View, Text } from "react-native";
import { activeFonts, colors, fontSizes } from "../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";

const AutoSuggestListItem = (props) => {
  const { name, handleList, setTextSource } = props;

  const handleSelect = async (text) => {
    setTextSource(true);
    handleList({ animal: text, value: 0 });
  };

  return (
    <View id={name} style={styles.suggestion}>
      <View style={{ zIndex: 90, backgroundColor: colors.themeWhite }}>
        <TouchableOpacity onPress={() => handleSelect(name)}>
          <Text
            style={{
              fontFamily: activeFonts.Light,
              fontSize: fontSizes.StandardText,
              textAlign: "center",
              color: colors.primaryBlue,
              zIndex: 90,
            }}
            onPress={() => handleSelect(name)}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    zIndex: 90,
    width: moderateScale(250),
    height: moderateScale(25),
    marginTop: 1,
    paddingTop: 3,
    backgroundColor: colors.themeWhite,
    color: colors.themeBlack,
    borderRadius: moderateScale(2),
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    listStyle: "none",
    transform: [{ translateX: 18 }],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 20,
  },
});

export default AutoSuggestListItem;
