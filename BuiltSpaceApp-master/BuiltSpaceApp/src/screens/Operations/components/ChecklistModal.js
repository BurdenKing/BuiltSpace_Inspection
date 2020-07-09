import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import {Text, View, Modal, TouchableOpacity, FlatList } from 'react-native';
import ChecklistIcon from 'react-native-vector-icons/FontAwesome5';
import styles from './Modalstyle.js';

export class ChecklistModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            checklistIsSelected: false,
            
        }
		this.setModalVisible = this.setModalVisible.bind(this)
		this.arrayholder = [];
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    searchFilterFunction = text => {
      this.setState({
        value: text,
      });
      const newData = this.props.checklists.filter(item => {
        const itemData = `${item.title.toUpperCase()}`;
        const textData = text.toUpperCase();
  
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        checklists: newData,
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
        <TouchableOpacity  style={styles.checklistItems} onPress={() => {
          this.props.onChecklistChange(false, '', 'checklist')
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
        checklists: null,
        modalIsOpen: false 
      }
    );
  }
    render() {

        const selected = <View>
                            <Text style={styles.optionText}> Checklist</Text>
                            <Text style={styles.detailsTextSelected}>{this.props.checklistTitle} </Text>
                        </View>
                    
        const noneSelected = <View>
                                <Text style={styles.optionText}> Checklist</Text>
                                <Text style={styles.detailsText}>None Selected </Text>
                            </View>

        return(
            <View style={{marginTop: 22}}>

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
                  <Text style={styles.headingTextBold}>Select a Checklist</Text>
                </View>
                <FlatList style={{ marginTop: 20, marginBottom: 120}}
                data={this.state.checklists || this.props.checklists} 
                renderItem = {({ item }) =>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.loadQuestions(item.questions, item.title, item.id)
                      this.setModalVisible(!this.state.modalVisible)
                    }}>
                    <View style={styles.checklistItems}>
                      <View style={styles.listIconContainter}>
                        <ChecklistIcon style={styles.listIcon} name="clipboard-list" size={50} color="black" />
                        <Text style={styles.listText}>Title: {item.title}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
                ListHeaderComponent={this.renderHeader}
                ></FlatList>

                {/* Bottom clos button container */}
                <View style={styles.bottomContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <ChecklistIcon style={styles.addIcon} name="window-close" size={27} color="white" />
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
    
            <TouchableOpacity disabled={this.props.disableChecklist ? true : false}
            style={[this.props.checklistSelected ? styles.textContainerSelected : styles.textContainer,
              this.props.disableChecklist ? styles.modalDisable : styles.modalEnable]}
              onPress={() => {
                this.resetModal()
                this.setModalVisible(true);
              }}>
            <View>
              {this.props.checklistSelected ? selected : noneSelected}
            </View>
            </TouchableOpacity>
          </View>
        )
    }
}

export default ChecklistModal