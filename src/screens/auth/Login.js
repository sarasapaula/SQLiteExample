import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

const db = SQLite.openDatabase("ejemplo.db");

//validar login usuario
const validateLogin = (user, loginGranted, errorLogin) => {
  // is user empty?
  if (user.email === null || user.email === "") {
    return false;
  }
  db.transaction(
    (tx)=>{
      tx.executeSql("select * from users where mail= ? and password= ?", [user.email,user.password], (_array, { rows }) =>{
        console.log("Resultado Login:",JSON.stringify(rows))
        if (rows.length>0)
          loginGranted();
        else
          errorLogin();  
    }
    );
  },
  errorLogin
  );
};
//validar mail
const validateMail = (user, mailOk, errorMail) => {
  // is user empty?
  if (user.email === null || user.email === "") {
    return false;
  }
  db.transaction(
    (tx)=>{
      tx.executeSql("select * from users where mail= ?", [user.email], (_array, { rows }) =>{
        console.log("Resultado Validate:",JSON.stringify(rows))
        if (rows.length===0){
          errorMail();
        }
        else
          mailOk();  
    }
    );
  },
  errorMail
  );
};

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
    

  function login() {
    setLoading(true);
    let user={ email,password};
    validateLogin(user, loginGranted, errorLogin);
  }
  function loginGranted(){
      setLoading(false);
      setEmail('');
      setPassword('');
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  function errorLogin(){
    let user={ email,password};
    validateMail(user, mailOk, errorMail);
  }
  function errorMail(){
    setLoading(false);
    alert("El mail ingresado no se encuentra registrado.");
  
  }
  function mailOk(){
    setLoading(false);
    alert("La contraseña ingresada no es correcta.");
  
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/login.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Login
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Continue"}
              onPress={() => {
                login();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AuthScreen', { screen: 'Register' });
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AuthScreen', { screen: 'ForgetPassword' })
                }}
              >
                <Text size="md" fontWeight="bold">
                  Forget password
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
