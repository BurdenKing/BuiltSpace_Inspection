import React, {Component} from 'react';
import {
  View,
  Stylesheet,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

export class LoadingScreen extends Component {
  /**
   * auth token checker
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this._getUser();
  }

  _getUser = () => {
    try {
      // Check if there is an existing user
      let user = false; // let user = false is temporary until we get a auth listener working
      this.props.navigation.navigate(user ? 'HomeStack' : 'Auth');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View>
       <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default LoadingScreen;
