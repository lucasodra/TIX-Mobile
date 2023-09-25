import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default ArtistBlock = ({
  clubName,
  points,
  artistDescription,
  artistIcon,
  onPressFunction,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleHeartPress = () => {
    // Toggle the isPressed state here
    setIsPressed(!isPressed);

    // You can add your logic for favoriting/unfavoriting here
    // For now, I'm just toggling the isPressed state
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onPressFunction
          ? onPressFunction()
          : console.log(artistName + " pressed");
      }}
    >
      <View style={styles.artistBlock}>
        {/* ICON */}
        <Image source={artistIcon} style={styles.artistIcon} />

        {/* TEXT CONTAINER */}
        <View style={styles.artistTextContainer}>
          {/* SPLITS INTO TITLE ROW AND DESCRIPTION ROW */}
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.clubName} numberOfLines={1}>
              {clubName}
            </Text>

            <Text style={styles.pointText} numberOfLines={1}>
              Your points: {points}
            </Text>

            {/* DESCRIPTION ROW */}
            <View style={styles.textConainer}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.artistDescription} numberOfLines={2}>
                  {artistDescription}
                </Text>
              </View>

              {/* FAVORITE ICON */}
              <Pressable onPress={handleHeartPress} style={styles.iconBox}>
                {/* <View style={styles.iconBox}> */}
                <Image
                  style={[
                    styles.favoriteIcon,
                    { tintColor: isPressed ? "red" : "#252F40" },
                  ]}
                  source={require("../../assets/favoriteiconfilled.png")}
                />
                {/* </View> */}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 100,
    borderRadius: 20,
    paddingTop: 5,
    width: "100%",
    marginTop: 15,
  },
  artistIcon: {
    width: 70,
    height: 70,
    borderRadius: 17,
    marginLeft: 5,
    marginRight: 10,
  },
  artistBlock: {
    flexDirection: "row",
  },
  artistTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  clubName: {
    fontSize: 15,
    fontFamily: "Lato-Bold",
    color: "#252F40",
    marginRight: 15,
    // backgroundColor: "yellow",
  },
  pointText: {
    fontSize: 14,
    fontFamily: "Lato-Light",
    color: "#252F40",
    textAlign: "left",
    marginRight: 15,
    marginTop: 5,
    // backgroundColor: "red",
  },

  // description row + icon
  textConainer: {
    marginTop: 8,
    flexDirection: "row",
    height: 40,
    // backgroundColor: "blue",
  },

  descriptionContainer: {
    flex: 8,
    // backgroundColor: "yellow",
  },

  artistDescription: {
    fontFamily: "Lato-Regular",
    color: "#252F40",
    flex: 8,
  },

  // favourite icon
  iconBox: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  favoriteIcon: {
    width: 15,
    height: 15,
  },
});
