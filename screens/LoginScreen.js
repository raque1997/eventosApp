import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import appFirebase from "../credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(appFirebase);

export default function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Iniciando sesión", "Accediendo...");
      props.navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image
          source={require("../assets/profile.jpg")}
          style={styles.profile}
        />
      </View>

      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Correo"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={iniciarSesion}>
            <Text style={styles.textoBoton}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
  },
  tarjeta: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: "#cccccc40",
    borderRadius: 30,
    marginVertical: 10,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "#525fe1",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
});
