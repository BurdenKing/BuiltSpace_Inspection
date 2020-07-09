import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ContextInfo} from '../../ContextInfoProvider';
import styles from './BuildingScreen.style.js';


export class SelectOrgScreen extends Component {
  static contextType = ContextInfo
  constructor(props) {
    super(props);
    this.state = {
      org_data: [],
    };
  }

  componentDidMount = () => {
    this.setState({
      org_data: this.props.navigation.state.params,
    })
  };

  render() {
    return (
      <View style={styles.select_container}>
        <Text style={styles.selectText}>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text style={styles.selectText}>Logged in as: {this.context.accountContext.account.email}</Text>
      <FlatList 
        data={this.state.org_data}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBuilding', {
            orgName: item
          })}>
            <View style={styles.select_row}>
              <Text style={styles.text}>{item.name}</Text>
              <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="black" />
              </View>
            </View>
          </TouchableOpacity>
   
        }
        keyExtractor={item => item.name}
        />
               
      </View>

    );
  }
}

export default SelectOrgScreen;
