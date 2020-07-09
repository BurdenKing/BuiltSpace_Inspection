import React, { Component, Fragment } from 'react';
import { SearchBar, CheckBox } from 'react-native-elements';
import { Text, View, Modal, TouchableOpacity, TouchableHighlight, FlatList, Button, TextInput, ScrollView, Alert} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import ChecklistIcon from 'react-native-vector-icons/FontAwesome5'
import { Dropdown } from 'react-native-material-dropdown';

import styles from './Modalstyle.js';
import {addAssetRealm, updateAsset} from '../../../storage/schema/dbSchema'
import{ContextInfo} from '../../../ContextInfoProvider'

export const ModalString = ""

export class AssetsModal extends Component {
  static contextType = ContextInfo;
  constructor(props) {
    super(props);
    
    this.state = {
      assetsFetched: false,
      modalVisible: false,
      modalAddAsset: false,
      modalEditAsset: false,
      isSelected: false,
      selection: "",
      showEdited: false,

      // add asset states
      addName: "",
      addMake: "",
      addModel: "",
      addSerial: "",
      addPhysical: "",
      addServices: "",
      addCategory: "",
      addDescription: "",    

      // for the asset name that will be listed on the modal
      assetModalName: this.props.assetTitle,

      editName: ""
    }
    this.setModalVisible = this.setModalVisible.bind(this)
    this.setModalAddAssetVisible = this.setModalAddAssetVisible.bind(this)
    this.setModalEditAssetVisible = this.setModalEditAssetVisible.bind(this)
    this.showEditedAsset = this.showEditedAsset.bind(this)
    this.addAsset = this.addAsset.bind(this)
    this.editAsset = this.editAsset.bind(this)
    this.resetAddedAssets = this.resetAddedAssets.bind(this)
    this.openEditModal = this.openEditModal.bind(this)
    this.addRealm = this.addRealm.bind(this)
    this.editRealm = this.editAsset.bind(this)
    this.assetModalName = this.assetModalName.bind(this)
  }

  componentDidMount(){
 //   console.log("Asset modal this.props.asset===="+JSON.stringify(this.props.assets));
  }
  // Adding an asset
  addAsset() {
      Alert.alert(
        'Add Asset',
        'Are you sure you want to add this asset?',
        [
          {
            text: 'Yes',
            onPress: () => this.addRealm()
          },
          {
            text: 'No'
          }
        ],
        { cancelable: false, }
      )
  }

addRealm() {
    // this.resetAddedAssets()
    addAssetRealm(this.context.accountContext.account,this.state.addName, this.state.addMake, this.state.addModel, this.state.addSerial,
      this.state.addPhysical, this.state.addCategory, this.state.addServices, this.state.addDescription) 

    // update the modal
    this.resetModal()
    this.setModalAddAssetVisible(!this.state.modalAddAsset)
}


editAsset() {
  updateAsset(this.context.accountContext.account, this.props.assetID, this.state.addName, this.state.addMake, this.state.addModel, this.state.addSerial,
    this.state.addPhysical, this.state.addCategory, this.state.addServices, this.state.addDescription) 

    this.setState({
      assetModalName: this.state.addName
    })
  Alert.alert(
    'Edit',
    'The asset has been edited',
    [
      {
        text: 'Ok',
        onPress: () => this.render()
        
      },
    ],
    { cancelable: false, }
  )
 }

 editRealm() {
  

    // this.resetModal()
    // this.setModalEditAssetVisible(!this.state.modalEditAsset)
 }


  // reset text input values of added assets
  resetAddedAssets() {
    console.log("Cleared Text Inputs For Added Assets")
    this.addedName.clear()
    this.addedMake.clear()
    this.addedModel.clear()
    this.addedCategory.clear()
    this.addedSerial.clear()
    this.addedDecription.clear()
    this.addedPhysical.clear()
    this.addedServices.clear()
  }
  showEditedAsset() {
    console.log(this.props.assetID)
    if (this.state.showEdited == true) {
      this.setState({
        showEdited: false
      })
    } else {
      this.setState({
        showEdited: true
      })
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  setModalAddAssetVisible(visible) {
    this.setState({ modalAddAsset: visible });
  }
  setModalEditAssetVisible(visible) {
    this.setState({ modalEditAsset: visible})
  }
  openEditModal() {
    this.resetModal()
    this.setModalEditAssetVisible(!this.state.modalEditAsset)
  }
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
      const newData = this.props.assets.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      assets: newData,
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
          this.props.onAssetChange(false, '', '', '', '', '', '', '', '', '', 'asset')
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
      assets: null,
      modalIsOpen: false 
    }
  );
}

componentDidMount() {
  this.timerID = setInterval(
    () => this.assetModalName(),
    1000
  );
}

// componentWillMount() {
//   clearInterval(this.timerID)
// }

assetModalName() {
  this.setState({
    assetModalName: this.props.assetTitle
  })
}

render() {    

    const selected = <View>
                        <Text style={styles.optionText}> Assets</Text>
                        <View style={{flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%"}}>
                          <Text style={styles.detailsTextSelected}>{this.state.assetModalName} </Text>
                          <Button title="Edit" onPress={() => this.openEditModal()}/>
                        </View>
                     </View>
    const noneSelected = <View>
                          <Text style={styles.optionText}> Assets</Text>
                          <Text style={styles.detailsText}>None Selected </Text>
                         </View>
    return (
    <View style={{marginTop: 22}}>
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.resetModal()
            this.setModalVisible(!this.state.modalVisible)
        }}>
     
          <View style={styles.listContainer}>
            <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Select an Asset</Text>
            </View>

            <FlatList style={{marginBottom: 110}}
              data={ this.state.assets || this.props.assets} //checks if this.state.assets exists, or use this.props.assets
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() => {
                    this.props.assetsFilter(item)
                    this.props.onAssetChange(true, item.name, item.make, item.model, item.serial, 
                      item.categoryabbr, item.description, item.spaces, item.servicespaces, item.id, 'asset')
                    this.setModalVisible(!this.state.modalVisible)
                    
                  }}>
                  <View style={styles.assetListItems}>
                    <View style={styles.listIconContainer}>
                      <ChecklistIcon style={styles.listIcon} name="bullseye" size={50} color="black" />
                      <View >
                        <Text style={styles.listText}>Name: {item.name}</Text>
                        <Text style={styles.listText}>Serial: {item.serial}</Text>
                        <Text style={styles.listText}>Model: {item.model}</Text>
                        <Text style={styles.listText}>Make: {item.make}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={item => item.id}
              ListHeaderComponent={this.renderHeader}
            >
          
          </FlatList>
            {/* Bottom clos button container */}
            <View style={styles.bottomContainer}>
              <View style={{flexDirection:'row', flex: 2}}>
                <View style={{flex: 2, justifyContent: 'center', paddingBottom: 2}}>
                  <TouchableOpacity

                    onPress={() => {
                    this.resetModal()
                    this.setModalVisible(!this.state.modalVisible);
                    this.setModalAddAssetVisible(this.state.modalAddAsset)
                  }}>
                    <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#95C8D8', paddingBottom: 2}}>
                  <TouchableOpacity
                    onPress={() => {
                    this.resetModal()
                    this.setModalAddAssetVisible(!this.state.modalAddAsset);
                  }}>
                     <ChecklistIcon style={styles.addIcon} name="plus" size={27} color="white" />
                    <Text style={styles.closeButton}>New Asset</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
           
          </View>
        </Modal>

        <TouchableOpacity style={[this.props.assetSelected ? styles.textContainerSelected : styles.textContainer]}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          {this.props.assetSelected ? selected : noneSelected}
        </TouchableOpacity>
      </View> 

      {/* 
      
      
      ADD ASSET
      
      
      */}
      <View>
      <Modal
        style={{flex: 1}}
        animationType="slide"
        transparent={false}
        visible={this.state.modalAddAsset}
        onRequestClose={() => {
          this.resetModal()
          this.setModalAddAssetVisible(!this.state.modalAddAsset)
        }}>
          <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Add Asset</Text>
          </View>
          
          <ScrollView>
            <View style={{flex: 1, marginBottom: 105, marginTop: 5}}>
              <View style={{backgroundColor: 'white', margin: 5, padding: 5}}>
            
                <Text>Name</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    textAlignVertical={"top"}
                    onChangeText={addName => this.setState({ addName })}
                    ref={value => {this.addedName = value}}
                    placeholder=" - Add Name -"
                />
        
                <Text>Make</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addMake => this.setState({ addMake })}
                    ref={value => {this.addedMake = value}}
                    placeholder=" - Add Make -"
                  />

                <Text>Model</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addModel => this.setState({ addModel })}
                    ref={value => {this.addedModel = value}}
                    placeholder=" - Add Model -"

                  />
          
                <Text>Serial #</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addSerial => this.setState({ addSerial })}
                    ref={value => {this.addedSerial = value}}
                    placeholder=" - Add Serial # -"
                  />
          
                <Text>Category</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addCategory => this.setState({ addCategory })}
                    ref={value => {this.addedCategory = value}}
                    placeholder=" - Add Category -"
                  />
        
                <Text>Description</Text>
                  <TextInput
                    style={{ margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    numberOfLines={3}
                    ref={value => {this.addedDecription = value}}
                    onChangeText={addDescription => this.setState({ addDescription })}
                    placeholder=" - Add Description -"
                  />

                <Text>Physical Space(s)</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addPhysical => this.setState({ addPhysical })}
                    ref={value => {this.addedPhysical = value}}
                    placeholder=" - Add Physical Space(s) -"
                  />
                
                <Text>Service Space(s)</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={addServices => this.setState({ addServices })}
                    ref={value => {this.addedServices = value}}
                    placeholder=" - Add Service Space(s) -"
                  />

                {/* <Button 
                  onPress={() => this.addAsset()} 
                  title="Add Asset"
                  style={{ margin: 4}}>
                </Button>    */}
              </View>
             </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
              <View style={{flexDirection:'row', flex: 2}}>
                <View style={{flex: 2, justifyContent: 'center', paddingBottom: 2}}>
                  <TouchableOpacity

                    onPress={() => {
                    this.resetModal()
                    this.setModalAddAssetVisible(!this.state.modalAddAsset)
                  }}>
                    <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#95C8D8', paddingBottom: 2}}>
                  <TouchableOpacity
                    onPress={() => {
                    this.addAsset();
  
                  }}>
                     <ChecklistIcon style={styles.addIcon} name="check" size={27} color="white" />
                    <Text style={styles.closeButton}>Add Asset</Text>
                  </TouchableOpacity>
                </View>
              </View> 
          </View> 
           

        </Modal>
    </View>

     
      {/* 
      
      EDITING ASSET
      
      */}
      <View>
      <Modal
        style={{flex: 1}}
        animationType="slide"
        transparent={false}
        visible={this.state.modalEditAsset}
        onRequestClose={() => {
          this.resetModal()
          this.setModalEditAssetVisible(!this.state.modalEditAsset)
        }}>
          <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Edit Asset</Text>
          </View>
          
          <ScrollView>
            <View style={{flex: 1, marginBottom: 105, marginTop: 5}}>
              <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>

                <Text>Name</Text>
                  <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    textAlignVertical={"top"}
                    defaultValue={this.props.assetTitle}
                    onChangeText={addName => this.setState({ addName })}
                    placeholder=" - None -"
                  />
                
                  <Text>Make</Text>
                    <TextInput 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                      defaultValue={this.props.assetMake}
                      placeholder=" - None -"
                      onChangeText={addMake => this.setState({ addMake })}
                    />
                  
                  <Text>Model</Text>
                    <TextInput 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                      defaultValue={this.props.assetModel}
                      placeholder=" - None -"
                      onChangeText={addModel => this.setState({ addModel })}
                    />
                  
              
                  <Text>Serial #</Text>
                    <TextInput 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                      defaultValue={this.props.assetSerial}
                      placeholder=" - None -"
                      onChangeText={addSerial => this.setState({ addSerial })}
                    />

                  <Text>Category</Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    defaultValue={this.props.assetCategory}
                    placeholder=" - None -"
                    onChangeText={addCategory => this.setState({ addCategory })}
                    />

          
                  <Text>Description</Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: 'black', backgroundColor: 'white' }}
                      multiline
                      numberOfLines={3}
                      defaultValue={this.props.assetDescription}
                      onChangeText={addDescription => this.setState({ addDescription })}
                      placeholder=" - None -"
                    />
                
                  <Text>Physical Space(s)</Text>
                    <TextInput 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                      defaultValue={this.props.assetPhysical}
                      placeholder=" - None -"
                      onChangeText={addPhysical => this.setState({ addPhysical })}
                    />

                  <Text>Service Space(s)</Text>
                    <TextInput 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                      defaultValue={this.state.assetID}
                      placeholder=" - None -"     
                      onChangeText={addServices => this.setState({ addServices })}
                    />
        
                    {/* <Button 
                      style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }} 
                      title="Submit"
                      onPress={() => this.editAsset()} 
                    /> */}

              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
            <View style={{flexDirection:'row', flex: 2}}>
                <View style={{flex: 2, justifyContent: 'center', paddingBottom: 2}}>
                    <TouchableOpacity

                      onPress={() => {
                      this.resetModal()
                      this.setModalEditAssetVisible(!this.state.modalEditAsset)
                    }}>
                      <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                      <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{flex: 2, justifyContent: 'center', backgroundColor: '#95C8D8', paddingBottom: 2}}>
                    <TouchableOpacity
                      onPress={() => {
                      this.editAsset();
    
                    }}>
                      <ChecklistIcon style={styles.addIcon} name="check" size={27} color="white" />
                      <Text style={styles.closeButton}>Edit Asset</Text>
                    </TouchableOpacity>
                </View>
            </View> 
          </View> 
           

      </Modal>
      </View>
      
      </View>
    )
  }
}
export default AssetsModal;