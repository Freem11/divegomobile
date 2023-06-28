import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, } from "react-native";

const PhotoMenuListItem = (props) => {
  const { pic, setAnimalMultiSelection, animalMultiSelection } = props;

  const handleSelect = (name) => {

    if (animalMultiSelection.includes(name)) {
      setAnimalMultiSelection(
        animalMultiSelection.filter((item) => item !== name)
      );
    } else {
      setAnimalMultiSelection([...animalMultiSelection, name]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => handleSelect(pic.label)} key={pic.id}>
    <View
      style={
        animalMultiSelection.includes(pic.label)
          ? styles.shadowboxSelected
          : styles.shadowbox
      }
      key={pic.id}
    >
      <Text
        style={
          animalMultiSelection.includes(pic.label)
            ? styles.photolabelSelected
            : styles.photolabel
        }
      >
        {pic.label}
      </Text>
      <Image
        source={{
          uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${pic.photoFile}`,
        }}
        style={{
          height: 60,
          width: 120,
          borderBottomRightRadius: 15,
          borderBottomLeftRadius: 15,
          resizeMode: "cover",
        }}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  photolabel: {
    fontSize: 11,
    color: "white",
    textAlign: "center",
    height: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 3,
    fontFamily: "IndieFlower_400Regular",
  },
  photolabelSelected: {
    fontSize: 11,
    color: "black",
    textAlign: "center",
    height: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 3,
    fontFamily: "IndieFlower_400Regular",
  },
  shadowbox: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    backgroundColor: "darkblue",
  },
  shadowboxSelected: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    backgroundColor: "gold",
  },
});

export default PhotoMenuListItem;
