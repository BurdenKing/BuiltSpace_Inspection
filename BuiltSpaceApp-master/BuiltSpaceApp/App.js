/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
} from "react-native";

// import BottomTabNavigator from './src/BottomTabNavigator.js';
import Navigator from "./src/Navigator/Navigator.js";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ContextInfoProvider from "./src/ContextInfoProvider";
import FlashMessage from "react-native-flash-message";

class App extends Component {
    render() {
        return (
            <SafeAreaProvider>
                <ContextInfoProvider>
                    <Navigator />
                </ContextInfoProvider>
                <FlashMessage position="top" />
            </SafeAreaProvider>
        );
    }
}
export default App;
console.disableYellowBox = true;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#324679",
        alignItems: "center",
        justifyContent: "center",
    },
});
