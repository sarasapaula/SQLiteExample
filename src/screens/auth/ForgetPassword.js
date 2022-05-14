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

//actualizar password
const updatePassword = (user, updateOk, errorUpdate) => {
  // is user empty?
  if (user.email === null || user.email === "") {
    return false;
  }
  console.log("user",user)
  db.transaction(
    (tx)=>{
      tx.executeSql("update users set password= ? where mail= ?", [user.password,user.email]);
      //verificamos
      tx.executeSql("select * from users where mail= ?", [user.email], (_, { rows }) =>{
            console.log("Resultado Update:",JSON.stringify(rows))
        if (rows.length>0)
          updateOk();
        else
          errorUpdate();  
    }
    );
  },
  errorUpdate
  );
};
//validar mail
const validateMail = (user, errorPassword, errorMail) => {
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
          errorPassword();  
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

  function forget() {
    let user ={email,password}
    updatePassword(user,updateOk,errorUpdate);
          
  }
  function updateOk(){
    setLoading(false);
    setEmail('');
    setPassword('');
    alert("La contraseña ha sido modificada con exito, ya puedes ingresar a la aplicacion.")
    navigation.navigate('AuthScreen', { screen: 'Login' });
  }

  function errorUpdate(){ 
    let user={ email,password};
    validateMail(user, mailOk, errorMail);
  }
  function errorMail(){
    setLoading(false);
    alert("El mail ingresado no se encuentra registrado.");

  }
  function errorPassword(){
    setLoading(false);
    alert("La contraseña ingresada no es valida. Intente nuevamente");

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
              source={require("../../../assets/forget.png")}
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
              size="h3"
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Forget Password
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
              placeholder="Enter your new password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Reset Password"}
              onPress={() => {
                forget();
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
              <Text size="md">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AuthScreen', { screen: 'Login' });
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Login here
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
