import React, { useState } from "react";
import { useEffect } from "react";
import * as Location from 'expo-location';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
//import { Formik } from 'formik'
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import RNPickerSelect from 'react-native-picker-select';


const RegisterPage = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate("FillLoginPage");
  };
  const route   = useRoute();
  const [agencyName, setAgencyName] = useState("");
  const email = route.params?.email || "No email found";
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [agencyType, setAgencyType] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const data = [
    { label: 'Police', value: 'Police' },
    { label: 'Fire Brigade', value: 'Fire-Brigade' },
    { label: 'Hospital', value: 'Hospital' },
    { label: 'CRPF', value: 'CRPF' },
    { label: 'NDRF', value: 'NDRF' },
    { label: 'SRPF', value: 'SRPF' },
    { label: 'Army', value: 'Army' },
    // Add more options as needed
  ];


  
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location", currentLocation);
    } catch (error) {
      console.error('Location fetching error:', error.message);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleRegister = async () => {
    try {
      await fetchLocation();
      console.log("Printing in Register Page",agencyName,contactNumber,confirmEmail,address);
      
      const response = await axios.post('https://tiny-pink-binturong-tutu.cyclic.app/api/v1/auth/register', {
        Name:agencyName,
        email:email,
        password,
        confirmPassword:confirmEmail,
        agencyType:agencyType,
        contactNumber:contactNumber,
        lat:location.coords.latitude,
        lng:location.coords.longitude,
        address,
      });
      if (response.status === 200) {
        navigation.navigate("FillLoginPage", { email });
      } else if (response.status === 400) {
        console.log("OTP Incorrect");
      }
      
      

      // Handle success or display a success message to the user
    } catch (error) {
      console.error('Registration error:', error.message);

      // Handle error or display an error message to the user
    }
  };

  const handleAutoFill = async () => {
    try {
      await fetchLocation();

      // Use Google Maps Geocoding API to get the address
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyAv2mNDcGW3aO-rWP3sgPHsWEizt_u8OZ8`
      );

      if (response.data.status === "OK") {
        const formattedAddress = response.data.results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        console.log("Unable to fetch address from coordinates");
      }
    } catch (error) {
      console.error('Auto-fill error:', error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.pageName}>Register your Agency</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Agency Name"
        value={agencyName}
        onChangeText={(text) => setAgencyName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder={`${email}`}
        defaultValue={email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Set password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirmEmail}
        onChangeText={(text) => setConfirmEmail(text)}
        keyboardType="email-address"
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Agency Type"
        value={agencyType}
        onChangeText={(text) => setAgencyType(text)}
        keyboardType="email-address"
      /> */}
      <View style={styles.dropdown}>
                    <RNPickerSelect
                        onValueChange={(value) => setAgencyType(value)}
                        items={data}
                        placeholder={{ label: 'Select Agency Type', value: null }}
                        // style={pickerSelectStyles}
                    />
                </View>
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
        // keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
        
      />
      

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.Lbutton} onPress={handleRegister}>
          <Text style={styles.buttonTextRegister}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Rbutton} onPress={handleAutoFill}>
          <Text style={styles.buttonTextGPS}>GPS (auto fill)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.alreadyRegistered}>Already Registered?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLoginPress}>
          <Text style={styles.Login}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     height: 50,
//     width: "100%",
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 10,
//     backgroundColor: "white",
//     paddingHorizontal: 8,
//     paddingVertical: 15,
//     marginVertical: 2,
//   },
//   inputAndroid: {
//     height: 50,
//     width: "100%",
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 10,
//     backgroundColor: "white",
//     paddingHorizontal: 8,
//     paddingVertical: 15,
//     marginVertical: 2,
//   },
//   textInputProps: {
//     color: 'black', // Set text color to black
//   }
// });

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#003366",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageName: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
    padding: 15,
    marginVertical: 2,
    padding: 15,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  buttonTextRegister: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonTextGPS: {
    color: "#FC5B28",
    fontWeight: "bold",
    fontSize: 18,
  },
  Lbutton: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    backgroundColor: "#FC5B28",
  },
  Rbutton: {
    padding: 15,
    marginVertical: 0,
    borderRadius: 7,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alreadyRegistered: {
    color: "white",
  },
  Login: {
    color: "#FC5B28",
  },
  dropdown: {
    backgroundColor: "white",
    fontWeight: "bold",
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1, // Add border width
    width: "100%",
    height: 50,
    // marginLeft: 50,
    marginTop: 1,
},

});

export default RegisterPage;
