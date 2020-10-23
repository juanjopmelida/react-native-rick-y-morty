import React from "react";
import Axios from "axios";
import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import logo from "./assets/VT-Logo.png";

export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    user: "",
    password: "",
    loading: "",
    message: "",
    characters: [],
  };

  componentDidMount() {
    //this.login();
    this.getCharacters();
  }

  authenticate = (user, password) => {
    this.setState({ loading: true, message: "" });
    const credentials = Axios.post(
      API_URL,
      {
        user: user,
        password: password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
      .then(async (res) => {
        alert(`Hola ${user}`);
        this.setState({ loading: false });
        if (res.data) {
          await AsyncStorage.setItem("user", user);
          await AsyncStorage.setItem("password", password);
          //this.props.navigation.navigate("Home");
        } else {
          this.setState({ message: "This user doesn't exist", loading: false });
          alert(`${res.err}`);
        }
      })
      .catch((err) => {
        alert(`Ha entrado al catch: ${err}`);
        this.setState({
          message: "Error connecting to the server. Please try again later.",
          loading: false,
        });
        alert(`${err}`);
      });
  };

  login = async () => {
    const user = await AsyncStorage.getItem("user");
    const password = await AsyncStorage.getItem("password");

    if (user && password) {
      this.setState({ user: user, password: password });
      this.authenticate(user, password);
    }
  };

  getCharacters = () => {
    Axios.get(`${API_RICKYANDMORTY}character`)
      .then((response) => {
        this.setState({
          characters: (response.data && response.data.results) || [],
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };
  /* 
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Viasat Of Things</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="User..."
            onChangeText={(text) => {
              AsyncStorage.setItem("user", JSON.stringify(text));
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            onChangeText={(text) => {
              AsyncStorage.setItem("password", JSON.stringify(text));
            }}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.login()}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  } */
  render() {
    return (
      <View style={styles.container}>
        <Text>Personajes</Text>
        <FlatList
          style={styles.list}
          data={this.state.characters}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.row}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="contain"
                />

                <View style={[styles.column, { marginLeft: 10 }]}>
                  <Text style={[styles.text, { fontWeight: "bold" }]}>
                    {item.name}
                  </Text>
                  <Text stylew={styles.text}>{item.species}</Text>
                  <Text stylew={styles.text}>{item.status}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
const API_URL =
  "https://dotpre.grupodetector.com/vot/api/security/authentication/login";
const API_RICKYANDMORTY = "https://rickandmortyapi.com/api/";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    color: "#009FE3",
    marginBottom: 40,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#3A92EF",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
  list: {
    flex: 1,
    width: "100%",
    padding: 10,
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 18,
  },
});
