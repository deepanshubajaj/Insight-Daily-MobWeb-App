import React, { useState } from "react";
import {
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
  View,
  Linking,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { Text } from "../../components/Themed";
import Email from "react-native-email";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ENV } from "../../env";
import { router } from "expo-router";

export default function ContactScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = () => {
    const to = ENV.CONTACT_EMAIL;
    const subject = `Contact from ${name} (${email})`;
    const body = message;

    Email(email, { subject, body }).catch(console.error);
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && { backgroundColor: '#000' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={goBack}
      >
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
        <Text style={[styles.backButtonText, isDarkMode && { color: '#fff' }]}>Back</Text>
      </TouchableOpacity>
      
      <View style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
        <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>Contact Us</Text>
        <View style={styles.separator} />
        <Image
          source={require("../../assets/images/contact.jpg")}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <TextInput
          style={[styles.input, isDarkMode && { color: 'white', borderColor: '#444' }]}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <TextInput
          style={[styles.input, isDarkMode && { color: 'white', borderColor: '#444' }]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <TextInput
          style={[styles.input, { height: 100 }, isDarkMode && { color: 'white', borderColor: '#444' }]}
          placeholder="Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <TouchableOpacity onPress={sendEmail} style={styles.emailButton}>
          <Text style={styles.emailButtonText}>Contact Me</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <View style={[styles.socialLinks, isDarkMode && { backgroundColor: '#000', borderColor: '#444' }]}>
          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.GITHUB)}>
            <Ionicons name="logo-github" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.FACEBOOK)}>
            <Ionicons name="logo-facebook" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.LINKEDIN)}>
            <Ionicons name="logo-linkedin" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.TWITTER)}>
            <Ionicons name="logo-twitter" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.INSTAGRAM)}>
            <Ionicons name="logo-instagram" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(ENV.SOCIAL_LINKS.PORTFOLIO)}>
            <Ionicons name="briefcase" size={32} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    width: "100%",
    color: "black",
    backgroundColor: "transparent",
  },
  emailButton: {
    marginTop: 10,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  emailButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    width: "100%",
  },
  icon: {
    padding: 5,
  },
});
