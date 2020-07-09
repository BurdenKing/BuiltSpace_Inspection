import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Keyboard, StatusBar, ScrollView } from 'react-native';
import {ContextInfo} from '../../ContextInfoProvider';
import styles from './Login.style.js';

export default class LoginForm extends Component {
    static contextType = ContextInfo
    constructor(props){
        super(props)
        this.state = {
            account: {
                api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
                email: 'bcitbuiltspace@gmail.com',
                id: 400,
            },
        } 
    }
    render() {
        return (
            <KeyboardAvoidingView behavior = "padding" style = {styles.form_container} >
            <StatusBar 
                barStyle = "light-content" 
            />
            <TextInput
                placeholder = "Email Address"
                placeholderTextColor = "rgba(255, 255, 255, 0.7)"
                returnKeyType = "next"
                onSubmitEditing = {() => this.passwordInput.focus()}
                keyboardType = "email-address"
                autoCapitalize = "none"
                autoCorrect = {false}
                style = {styles.input}
            /> 
            <TextInput
                placeholder = "Password"
                placeholderTextColor = "rgba(255, 255, 255, 0.7)"
                returnKeyType = "go"
                secureTextEntry style = {styles.input}
                ref = {(input) => this.passwordInput = input}
            />
            <TouchableOpacity style = {styles.buttonContainer}
                    onPress={() => {{
                        this.context.accountContext.setAccount(this.state.account)
                        this.props.navigation('HomeStack')
                        }
                    }}>
                <Text style = {styles.buttonText} > Login </Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}