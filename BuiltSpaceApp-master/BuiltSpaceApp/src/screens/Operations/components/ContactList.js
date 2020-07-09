
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, PermissionsAndroid, Button, Dimensions } from 'react-native';
import Contacts from 'react-native-contacts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';


export default class ContactList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      selectedContacts: [],
    }

    this.arrayHolder = [];
  }

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayHolder.filter(item => {
      const itemData = `${item.displayName.toUpperCase()}`
      const textData = text.toUpperCase()

      return itemData.indexOf(textData) > -1
    });
    this.setState({
      contacts: newData,
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    var exploringEmails = navigation.getParam('exploreEmails')
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.'
        }
      ).then(() => {
        Contacts.getAll((err, contactsData) => {
          if (err === 'denied') {
            console.warn('Contact access denied')
          } else {
            //Filter out contacts with no emails
            var temp = contactsData.filter(item => item.emailAddresses.filter(x => x).length)
            contactsData = temp
            contactsData.map(info => {
              if (exploringEmails.includes(info.emailAddresses[0].email)) {
                info.check = true;   
              } else {
                info.check = false;
              }
              return contactsData;
            })
            // contacts returned in Array
            this.setState({
              contacts: contactsData,
            })
            this.arrayHolder = contactsData;
          }
        })
      })
    }
  }

  doneButton = () => {
    var temp = this.state.selectedContacts
    this.state.contacts.map((item) =>{
      if(item.check === true && !this.state.selectedContacts.includes(item)){
        temp.push(item)
      }
    })
    this.setState({
      selectedContacts:temp
    })
    // console.log("Contacts from contacts page")
    // console.log(this.state.selectedContacts)
    // console.log(this.state.inputEmails)
    this.props.navigation.navigate('ExploreBuilding', {
      contactsCallBack: this.state.selectedContacts,
      // inputCallBack: this.state.inputEmails,
    })
  }

  press = (x) => {
    this.state.contacts.map((item) => {
      if (item.recordID === x.recordID) {
        item.check = !item.check
        if (item.check === true) {
          this.state.selectedContacts.push(item);
        } else if (item.check === false) {
          const i = this.state.selectedContacts.indexOf(item)
          if (1 != -1) {
            this.state.selectedContacts.splice(i, 1)
            return this.state.selectedContacts
          }
        }
      }
    })
    this.setState({ contacts: this.state.contacts })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <View>
        <SearchBar
          placeholder='Search by name...'
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.value}
        />
      </View>
    );
  };

  render() {
    return (
      <View >
        <View style={styles.container}>
          <FlatList
            data={this.state.contacts}
            keyExtractor={item => item.recordID}
            ListHeaderComponent={this.renderHeader}
            renderItem={({ item }) => {

              return <TouchableOpacity
                onPress={() => {
                  this.press(item)
                }}>
                <View style={styles.itemView}>
                  <View style={styles.iconContainer}>
                    <Icon name='ios-mail' size={30} color='#43BC4F'></Icon>
                  </View>
                  {(item.check)
                    ? (
                      <Text style={styles.itemInfo}>
                        <Text style={styles.name}>{`${item.displayName}`} </Text>
                        <Text>{`${item.emailAddresses[0].email}`}</Text>
                      </Text>

                    )
                    : (
                      <Text style={styles.itemInfo}>
                        <Text style={styles.name}>{`${item.displayName}`} </Text>
                        <Text>{`${item.emailAddresses[0].email}`}</Text>
                      </Text>
                    )}
                  <View style={styles.checkboxContainer}>
                    {item.check
                      ? (
                        <Icon name='ios-checkbox' size={30} color={'#43BC4F'}></Icon>
                      )
                      : (
                        <Icon name='ios-square-outline' size={30} color={'#43BC4F'}></Icon>
                      )}
                  </View>
                </View>
              </TouchableOpacity>
            }} />
        </View>
        <Button
          text-color='white'
          color='#43BC4F'
          title='Done'
          onPress={
            () => this.doneButton()
        }>
        </Button>
      </View>

    );
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  itemView: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderColor: '#43BC4F',
    borderBottomWidth: 1.5,
    alignContent: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    flex: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  checkboxContainer: {
    alignItems: 'flex-end',
    marginVertical: 15,
  },
  itemInfo: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  name: {
    fontSize: 20,
    color: 'green',
    textAlign: 'left',
  },
});