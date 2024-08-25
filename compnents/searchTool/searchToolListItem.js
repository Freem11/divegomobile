import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";

export default SearchToolListItem = (props) => {
  const { setList, name, setSearchValue, setTextSource } = props;

  const handleSelect = async (text) => {
    setTextSource(true);
    setSearchValue(text);
    setList([]);
  };

  return (
    <View id={name} style={styles.suggestion}>
      <View>
        <TouchableOpacity
          onPress={() => handleSelect(name)}
          style={{
            width: "100%",
            height: moderateScale(30),
          }}
        >
          <Text
            style={{
              fontFamily: "Itim_400Regular",
              fontSize: moderateScale(20),
              textAlign: "center",
              color: "#F0EEEB",
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
    height: moderateScale(40),
    width: moderateScale(320),
    backgroundColor: "#538dbd",
    borderRadius: 5,
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    listStyle: "none",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 20,
  },
});
