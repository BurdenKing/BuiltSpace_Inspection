import React, { Component } from 'react';
import {Text, View, Modal, TouchableOpacity, FlatList, TextInput, ScrollView, Alert,  Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Location from 'react-native-vector-icons/SimpleLineIcons'
import { SearchBar } from 'react-native-elements';
import { set } from 'react-native-reanimated';
import styles from './Modalstyle.js';
import {addSpaceRealm} from '../../../storage/schema/dbSchema'
import DropDownPicker from 'react-native-dropdown-picker';
import ChecklistIcon from 'react-native-vector-icons/FontAwesome5'
import{ContextInfo} from '../../../ContextInfoProvider'
import { Dropdown } from 'react-native-material-dropdown';

export class SpacesModal extends Component {
  static contextType = ContextInfo;
  constructor(props) {
    super(props);
    this.state = {
      spaces: this.props.spaces,
      spacesFetched: false,
      modalAddSpace: false,
      modalVisible: false,
      isSelected: false,
      selection: "",

      // add space
      addSpace: "",
      addFloor: "",
      addUsage: ""
      
    }
    this.setModalVisible = this.setModalVisible.bind(this)
    this.setModalSpaceVisible = this.setModalSpaceVisible.bind(this)
    this.addSpace = this.addSpace.bind(this)
    this.resetAddedSpaces = this.resetAddedSpaces.bind(this)
    this.addSpaceRealms = this.addSpaceRealms.bind(this)
  }
   // Adding an space
   addSpace() {
      Alert.alert(
        'Add Space',
        'Are you sure you want to add this space?',
        [
          {
            text: 'Yes',
            onPress: () => this.addSpaceRealms()
          },
          {
            text: 'No'
          }
        ],
        { cancelable: false, }
        
      )
  }

  addSpaceRealms() {
    addSpaceRealm(this.context.accountContext.account, this.state.addSpace, this.state.addFloor, this.state.addUsage)

    this.resetModal()
    this.setModalSpaceVisible(!this.state.modalAddSpace)
  
  }

  resetAddedSpaces() {
    console.log("Reset Space values")
    this.addedSpace.clear()
    // this.addedUsage.clear()
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setModalSpaceVisible(visible) {
    this.setState({ modalAddSpace: visible });
  }

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
    const newData = this.props.spaces.filter(item => {
      const itemData = `${item.floor.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      spaces: newData,
    });
  };


  renderHeader = () => {
    return (
      <View>
        <SearchBar
          placeholder="Search"
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.value}
        />
        <TouchableOpacity  style={styles.assetListItems} onPress={() => {
          this.props.onSpaceChange(false, '', '', '', '', '', '', '', '', '', 'space')
          this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text style={styles.listText}>Select None</Text>
        </TouchableOpacity>
      </View>
    );
  };

  resetModal = () => {
    this.setState({ 
      value: null,
      spaces:this.props.spaces,
      modalIsOpen: false 
    }
  );
}

updateUsage = (value) => {
        this.setState({
            addUsage: value,
        })
    }
  render() {
    const {items} = this.state
    let totalSpaces = 0;
  
    const selected = <View>

        <Text style={styles.optionText}> Space</Text>
        <Text style={styles.detailsTextSelected}>{this.props.spaceName} </Text>

    </View>

    const noneSelected = <View>

        <Text style={styles.optionText}> Space</Text>
        <Text style={styles.detailsText}>None Selected </Text>

    </View>

    return (
      // 
      // LIST
      <View style={{ marginTop: 15, }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.resetModal()
            this.setModalVisible(!this.state.modalVisible);
          }}>

          <View style={styles.listContainer}>
            <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Select a Space</Text>
            </View>

            <FlatList style={{marginBottom: 110}}
              data={this.state.spaces}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() => {
                    this.props.spacesFilter(item)
                    this.setModalVisible(!this.state.modalVisible)
                    this.props.onSpaceChange('true', item.floor, '', '', '', '', '', '', '', '', 'space')
                  }}>

                  <View style={styles.assetListItems}>
                    <View style={styles.listIconContainer}>
                      <Location style={styles.listIcon} name="location-pin" size={30} color="black" />
                      <Text style={styles.listText}>{item.floor}</Text>
                    </View>
                    <View >
                      <Text style={styles.numAssets}><Text> Floor: 01</Text></Text>
                    </View>

                  </View>


                </TouchableOpacity>
              }
              keyExtractor={item => item.id}
              ListHeaderComponent={this.renderHeader}
            ></FlatList>
              {/* Bottom clos button container */}
              <View style={styles.bottomContainer}>
              <View style={{flexDirection:'row', flex: 2}}>
                <View style={{flex: 2, justifyContent: 'center', paddingBottom: 2}}>
                  <TouchableOpacity

                    onPress={() => {
                    this.resetModal()
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                     <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#95C8D8', paddingBottom: 2}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.resetModal()
                      this.setModalSpaceVisible(!this.state.modalAddSpace);
                  }}>
                    
                    <ChecklistIcon style={styles.addIcon} name="plus" size={27} color="white" />
                    <Text style={styles.closeButton}>New Space</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
           
          </View>
        </Modal>

        {/* 
        
        ADD SPACE

        */}
        <Modal
             animationType="slide"
             transparent={false}
             visible={this.state.modalAddSpace}
             onRequestClose={() => {
               this.resetModal()
               this.setModalSpaceVisible(!this.state.modalAddSpace)
             }}>

            <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Add Space</Text>
          </View>
                <View style={{flex: 1 }}>
                  <View style={{backgroundColor: 'white', margin: 5, padding: 5}}>
                  <Text>Add Space</Text>

                  <Text>Space</Text>
                      <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                        textAlignVertical={"top"}
                        onChangeText={addSpace => this.setState({ addSpace })}
                        ref={value => {this.addedSpace = value}}
                        placeholder=" - Add Space -"
                    />

                    <Text>Floor</Text>
                      <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                        textAlignVertical={"top"}
                        defaultValue="Floor: "
                        onChangeText={addFloor => this.setState({ addFloor })}
                        placeholder=" - Add Floor -"
                    />
            
                    {/* <Text>Usage</Text>
                      <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                        onChangeText={addUsage => this.setState({ addUsage })}
                        ref={value => {this.addedUsage = value}}
                        placeholder=" - Add Usage -"
                    /> */}

                    {/* <Text>Usage</Text> */}
                    <Dropdown
                        // style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1, paddingBotto: 20 }}
                        style={{margin: 4}}
                        label="Usage"
                        placeholder=" - Add Usage -"
                        data={[{ value: 'Exterior' }, { value: 'Occupiable' }, { value: 'Mechanical' },
                               { value: 'Common Area' }, { value: 'Utilities' }, { value: 'Storage' },
                               { value: 'Parking' }, { value: 'Others' }]}
                        onChangeText={(value) => this.updateUsage(value)}
                    >
                    </Dropdown>
                    

                    {/* <Button 
                      onPress={() => this.addSpace()} 
                      title="Add Space"
                      style={{ margin: 4, zIndex: -10}}>
                    </Button> */}
                    {/* Bottom clos button container */}
               



                  </View>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection:'row', flex: 2}}>
                      <View style={{flex: 2, justifyContent: 'center', paddingBottom: 2}}>
                        <TouchableOpacity

                          onPress={() => {
                            this.resetModal()
                            this.setModalSpaceVisible(!this.state.modalAddSpace)
                        }}>
                          <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                          <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#95C8D8', paddingBottom: 2}}>
                        <TouchableOpacity
                          onPress={() => {this.addSpace();}}>
                          
                          <ChecklistIcon style={styles.addIcon} name="check" size={27} color="white" />
                          <Text style={styles.closeButton}>Add Space</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                  </View>
        </Modal>

        <TouchableOpacity disabled={ this.props.disableSpace ? true : false}
        style={[this.props.spaceSelected ? styles.textContainerSelected : styles.textContainer,
                this.props.disableSpace ? styles.modalDisable : styles.modalEnable]}
          onPress={() => {
            this.resetModal()
            this.setModalVisible(true);
          }}>
          {this.props.spaceSelected ? selected : noneSelected}
        </TouchableOpacity>
      </View>
    )
  }
}


export default SpacesModal;