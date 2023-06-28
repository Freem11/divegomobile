import { StyleSheet, View, Text, Keyboard } from "react-native";

const AutoSuggestListItem = (props) => {
  const { setList, setPin, pin, name } = props;

  const handleSelect = (text) => {
    setPin({ ...pin, Animal: text });
    setList([]);
    Keyboard.dismiss();
  };

  return (
    <View id={name} style={styles.suggestion}>
      <View>
        <Text
          style={{ fontFamily: "IndieFlower_400Regular", textAlign: "center", color:"#F0EEEB" }}
          onPress={() => handleSelect(name)}
        >
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    width: 165,
    height: 25,
    marginTop: 1,
    paddingTop: 3,
    backgroundColor: "#538bdb",
    borderRadius: 5,
    textAlign: "center",
    alignContent: "center",
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
