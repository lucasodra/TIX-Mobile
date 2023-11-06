import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";

import moment from "moment";
import { React, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ColorContext } from "../../../context";
import { useContext } from "react";
import Button from "../../components/newApp/button";
import FooterBlock from "../../components/viewConcert/footerBlock";
import OptionFields from "../../components/concertCategory/optionFields";
import { Picker } from "@react-native-picker/picker";

export default ConcertCategoryPage = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const concert = route.params.concert;

  //code used to check if any sales round is open
  const showAlertAndNavigateBack = () => {
    Alert.alert("Sales round not open", "Please wait till further notice", [
      {
        text: "OK",
        onPress: () => {
          // Navigate back to the previous screen
          navigation.goBack();
        },
      },
    ]);
  };

  const currentDate = new Date();
  const salesRounds = concert.salesRound;

  //check which round it is now, if current round is public and within the current date, set true
  let anySalesRoundMatchesConditions = false;
  const filteredSalesRound = salesRounds.map((salesRound) => {
    const salesRoundStartDate = new Date(salesRound.start);
    const salesRoundEndDate = new Date(salesRound.end);
    if (
      currentDate >= salesRoundStartDate &&
      currentDate <= salesRoundEndDate &&
      salesRound.roundType == "public"
    ) {
      anySalesRoundMatchesConditions = true;
      return salesRound;
    } else {
    }
  });

  dateList = [];
  categoryAndPrice = [];

  //dateList from session
  function generateDateList(startDate, endDate) {
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate, "day")) {
      dateList.push(currentDate.format("D MMM YYYY"));
      currentDate.add(1, "day");
    }
    return dateList;
  }

  function generateCategoryAndPrice(data) {
    return data.map((item) => `${item.category} - $${item.price}`);
  }

  //check if anySalesRoundMatchesConditions == true, else navigate back as user is not allowed to buy tickets now
  if (!anySalesRoundMatchesConditions) {
    showAlertAndNavigateBack();
  } else {
    const quantityForRound = filteredSalesRound[0].allocation;
    const sessions = concert.sessions;
    const startDate = concert.sessions[0].start;
    const length = concert.sessions.length;
    const endDate = concert.sessions[length - 1].end;
    dateList = generateDateList(moment(startDate), moment(endDate));
    const prices = filteredSalesRound[0].prices;
    categoryAndPrice = generateCategoryAndPrice(prices);
  }

  //for dates - get the date from the session, the first array element and the last one
  const { colors } = useContext(ColorContext);
  // STATE VARIABLES to store the text input from the user for quantity and category
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const quantities = ["1", "2", "3", "4"];

  const [date, setDate] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [category, setCategory] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [eventID, setEventID] = useState(null);
  const [salesRoundID, setSalesRoundID] = useState(null);
  const [priceID, setPriceID] = useState(null);

  useEffect(() => {
    setIsButtonEnabled(date !== null && quantity !== null && category !== null);
  }, [date, quantity, category]);

  const handleDateChange = (selectedDate) => {
    getQuantity(category, selectedDate);
  };

  const handleCategoryChange = (selectedCategory) => {
    getQuantity(selectedCategory, date);
  };
  const getQuantity = (selectedCategory, selectedDate) => {
    if (selectedCategory != null && selectedDate != null) {
      const selectedDateSessions = concert.sessions.filter((session) => {
        const sessionDate = moment(session.start).format("D MMM YYYY");
        if (sessionDate === selectedDate) {
          const capacity = session.capacity;
          const selectedCategoryFiltered = selectedCategory
            .split("-")[0]
            .trim();
          const selectedCapacity = capacity.find(
            (individualCapacity) =>
              individualCapacity.category === selectedCategoryFiltered
          );
          if (selectedCapacity) {
            setAvailableQuantity(selectedCapacity.available);
            return selectedCapacity.available;
          }
        }
      });
    }
  };

  function getPriceID(eventID, salesRoundID, category, price, concert) {
    if (!concert || !concert._id) {
      console.error(
        `Concert with eventID ${eventID} not found or has no _id property.`
      );
      return null;
    }

    if (!concert.salesRound || !Array.isArray(concert.salesRound)) {
      console.error(
        `Concert with eventID ${eventID} has no valid sales rounds.`
      );
      return null;
    }

    const salesRound = concert.salesRound.find(
      (round) => round && round._id === salesRoundID
    );

    if (!salesRound) {
      console.error(
        `Sales round with salesRoundID ${salesRoundID} not found in concert ${eventID}.`
      );
      return null;
    }

    if (!salesRound.prices || !Array.isArray(salesRound.prices)) {
      console.error(`Sales round ${salesRoundID} has no valid prices.`);
      return null;
    }

    const priceInfo = salesRound.prices.find(
      (p) => p.category === category && p.price === price
    );

    if (!priceInfo) {
      console.error(
        `Price with category ${category} and price ${price} not found in sales round ${salesRoundID}.`
      );
      return null;
    }

    return priceInfo._id;
  }

  const styles = StyleSheet.create({
    container: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    layoutImage: {
      margin: 15,
      backgroundColor: colors.primary,
      width: "100%",
      borderRadius: 15,
      resizeMode: "contain",
      alignSelf: "center",
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Lato-Bold",
      color: colors.textPrimary,
      paddingVertical: 10,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
    },
  });

  return (
    // ensures that the content is not hidden by the phone's status bar or notches
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* this library component ensures that the input will jump above the keyboard when typing */}
      <KeyboardAwareScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.container}
        extraHeight={100} // Adjust this value as needed
        enableOnAndroid={true} // Set this to true for Android support
      >
        <View style={{ height: 17 }} />

        {/* image of the concert's category layout */}
        <Image
          source={require("../../assets/images/concertLayout.png")}
          style={styles.layoutImage}
        />

        <View style={{ height: 30 }} />

        {/* card that wraps all the input boxes */}
        <View
          style={{
            width: "100%",
            borderRadius: 20,
            backgroundColor: colors.primary,
            zIndex: 1,
            padding: 20,
          }}
        >
          {/* date picker that works on both iOS and Android */}
          <Text style={styles.subtitle}>Date</Text>
          <View>
            <Picker
              selectedValue={date}
              onValueChange={(itemValue) => {
                setDate(itemValue);
                setEventID(concert._id);
                setSalesRoundID(filteredSalesRound[0]._id);
                handleDateChange(itemValue); // Call handleDateChange when the user selects a date
              }}
            >
              {dateList.map((date, index) => (
                <Picker.Item key={index} label={date} value={date} />
              ))}
            </Picker>
          </View>

          {/* seat category selection */}
          <Text style={styles.subtitle}>Seat Category</Text>
          <View>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                handleCategoryChange(itemValue); // Call handleCategoryChange when the user selects a category
              }}
            >
              {categoryAndPrice.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>

          <Text style={{ color: colors.textPrimary, fontSize: 12, marginTop: 5 }}>
            Available Quantity: {availableQuantity}
          </Text>

          {/* quantity selection */}
          <Text style={styles.subtitle}>Quantity</Text>
          <View>
            <Picker
              selectedValue={quantity}
              onValueChange={(itemValue) => setQuantity(itemValue)}
            >
              {quantities.map((qty, index) => (
                <Picker.Item key={index} label={qty} value={qty} />
              ))}
            </Picker>
          </View>

          {/* button that brings you to the purchase confirmation page */}

          <View style={styles.buttonContainer}>
            <Button
              buttonText={"BOOK NOW"}
              onPressFunction={() => {
                const priceID = getPriceID(
                  eventID,
                  salesRoundID,
                  category.split("- $")[0].trim(),
                  parseFloat(category.split("- $")[1]),
                  concert
                );
                if (priceID) {
                  setPriceID(priceID);
                  navigation.navigate("purchaseTicketPage", {
                    date: date,
                    quantity: quantity,
                    category: category,
                    concertName: concert.name,
                    artist: concert.artistName,
                    eventID: eventID,
                    salesRoundID: salesRoundID,
                    priceID: priceID, // Pass the priceID to the next screen
                  });
                } else {
                  console.error("Price ID not found.");
                }
              }}
              enableCondition={isButtonEnabled}
            />
          </View>
        </View>

        <View style={{ height: 20 }} />

        <FooterBlock />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
