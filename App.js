import React,{useEffect} from "react";
import { ThemeProvider } from "react-native-rapi-ui";
import AppNavigator from "./src/navigation/AppNavigator";
import { LogBox } from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

//Funcion que permite abrir la BD
function openDatabase() {
  const db = SQLite.openDatabase("ejemplo.db");
  return db;
}

//Abrir BD del proyecto
const db = openDatabase();


export default function App() {
  const images = [
    require("./assets/icon.png"),
    require("./assets/splash.png"),
    require("./assets/login.png"),
    require("./assets/register.png"),
    require("./assets/forget.png"),
  ];

  
//Si la tabla usuario no existe la creamos
React.useEffect(() => {
  console.log("hook app")
  let email = 'prueba2';
  let pass='1234';
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists users (mail text primary key not null, password text);"
    );
    //verificamos
    tx.executeSql("select * from users", [], (_, { rows }) =>
          console.log("Inicio Aplicacion:",JSON.stringify(rows))
        );

  });
}, []);
  return (
    <ThemeProvider images={images}>
        <AppNavigator />
    </ThemeProvider>
  );
}
