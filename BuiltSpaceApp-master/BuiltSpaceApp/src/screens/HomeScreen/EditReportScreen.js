import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
  ListItem, 
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import { ContextInfo } from '../../ContextInfoProvider';
import { fetchOrgs } from '../../storage/fetchAPI';
import {
  insertNewAccount,
  checkAccountExists,
  checkDBExists,
  getAccountOrgs,
  updateAccount,
  getInspections,
  delInspections,
  updateInspectionReport,
 
} from '../../storage/schema/dbSchema';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'
import { useFocusEffect } from 'react-navigation';

import styles from './BuildingScreen.style.js';

import GeneralType2 from './components/GeneralType2.js'
import MaterialsType2 from './components/MaterialsType2.js'
import LabourType2 from './components/LabourType2.js'


import { Button } from 'react-native-elements';
import ExploreBuildingFlatlistFooter2 from './components/ExploreBuildingFlatlistFooter2.js';



export class EditReportScreen extends Component {
  static contextType = ContextInfo
    constructor(props) {
        super(props);
        this.state = {
          // Store user api key for reuse here?
          accountlastUpdated: '',
          organizations: [],
          isLoading: true,
          inspectionsList: this.props.navigation.state.params.inspectionsList,
          checked: [],
          setQuestions: [], // set of questions based on the selected checklist.
          submitSetQuestion:[],
          inspectionIndex:null,
          GeneralComments:'',
          submitGeneralComments:'',
        };
      }

      componentDidMount(){
       

        this.setState({
          setQuestions: Array.from(this.props.navigation.state.params.inspectionsList.Content.MyFields.Questions.Question), // set of questions based on the selected checklist.
          GeneralComments:this.props.navigation.state.params.inspectionsList.Content.MyFields.GeneralComments,
          inspectionIndex:this.props.navigation.state.params.inspectionIndex
        })
       
        var submitQuestionArr=[];
        for(var i=0;i<18;i++){
          var question={'QuestionId':2,'QuestionNumber':'01','TaskDetails':'','Choices':null,'InspectionResult':'','textOnlyForm':'','measurementUnit2':'','measurementUnit3':''}
          submitQuestionArr.push(question);
        
         
        }
        this.setState({
          submitSetQuestion:submitQuestionArr,
          isLoading:false
        })
      }

      updateQuestion = (index, value, type, measurement_label = '', measurement_unit = '') => {
        /*
          updates the question text input based on the type passed into the argument.
          
          This function will update the question based on the index loaded in the flatlist.
    
          There are checkers for each input text from the question and updates the property
          based on the type.
         */
     
       let question = this.state.submitSetQuestion.slice(index, index + 1); // shallow copy the question from setQuestions
    
       // console.log("this.state.setQuestion.InspectionResult=================="+JSON.stringify(this.state.setQuestions[0].InspectionResult));
      
       // this.state.setQuestions[0].InspectionResult="Check";
  
        if (type == "measurement") {
          question[0]["measurement_label"] = value
          question[0]["measurementUnit"] = measurement_unit
        }
        if (type == "TaskDetails") {
        
          question[0]["TaskDetails"] = value
        }
        // if (type == "UnitCost") {
        //   question[0]["type"] = value
        // }
        if (type == "InspectionResults") {
        
          question[0]["InspectionResult"] = value
        }
        if(type=="Choices"){
       
          question[0]["Choices"] = value
        }
        if (type == "TextOnly") {
          question[0]["textOnlyForm"] = value
        }
        if (type == "measurementUnit2") {
          question[0]["measurementUnit2"] = value
         
        }
        if (type == "measurementUnit3") {
          question[0]["measurementUnit3"] = value
         
        }
        // if (type == "Photos") {
        //   if (question[0]["Photos"] == undefined) {
        //     question[0]["Photos"] = []
        //   }
        //   question[0]["Photos"].push(value)
        // }
        // if (type == "delete Photo") {
        //   question[0]["Photos"].splice(value, 1)
        // }
        // if (type == "crop Photos") {
        //   question[0]["Photos"] = value
        // }
      }



      confirmation = (buttonType) => {
        // On submit/delete inspection, will alert the user for confirmation.
        Alert.alert(
          'Confirmation',
          `Are you sure to ${buttonType}?`,
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
              text: 'OK', onPress: () => {
                if (buttonType == 'Save') {
                 console.log("save")
                 if(this.state.GeneralComments==this.state.submitGeneralComments){
                  updateInspectionReport(this.context.accountContext.account,this.state.submitSetQuestion,this.state.inspectionIndex);
                 }else{
                  updateInspectionReport(this.context.accountContext.account,this.state.submitSetQuestion,this.state.inspectionIndex,this.state.submitGeneralComments);
                 }
              
                 this.props.navigation.navigate("Home")
            //   console.log(JSON.stringify(this.state.submitSetQuestion))
                }
                if (buttonType == "Back") {
                 console.log("back");
               
                 this.props.navigation.navigate("Home")
                }
              }
            },
          ],
          { cancelable: true }
        )
      }

      renderFlatlistFooter = () => {
        return <ExploreBuildingFlatlistFooter2 addQuestion={this.addQuestion} />
      }


    render() {
        
      
        return this.state.isLoading ? (
          <View>
            <ActivityIndicator />
            <Text>Loading...</Text>
          </View>
        ) : (
        <View>
          <Text>{this.props.navigation.state.params.inspectionsList.Name}</Text>
         
          <ScrollView>
              <FlatList style={styles.flatList}
              data={this.state.setQuestions}
              ListFooterComponent={this.renderFlatlistFooter}
              renderItem={({item,index}) =>{
                
                
                
              if (item.QuestionType === '') {
                return <GeneralType2 question={{
                  item,
                  index,
                  updateQuestion: this.updateQuestion,
                }} />
              }
              if (item.QuestionType === 'Labour') {
                return <LabourType2  question={{
                  item,
                  index,
                  updateQuestion: this.updateQuestion
                }} />
              }
              if (item.QuestionType === 'Materials') {
                return <MaterialsType2  question={{
                  item,
                  index,
                  updateQuestion: this.updateQuestion
                }} />
              }

              
              
                
              }
                      }
      
          keyExtractor={(item) => item.QuestionId}
          />
 
        <View style={{ flex: 2, flexDirection: 'column', margin: 15 }}>
            <View style={{ flex: 1 }}>
              <Text>Additional Comments</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'black', backgroundColor: 'white' }}
                multiline
                numberOfLines={4}
                textAlignVertical={"top"}
                defaultValue={this.state.GeneralComments}
                onChangeText={submitGeneralComments => {
                  this.setState({ submitGeneralComments })
                    }
              }
              />
            </View>
        </View> 

        <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                      <View style={{ flex: 1, margin: 5 }}>
                        <Button style={{ flex: 1, margin: 5 }}
                          type="solid"
                          buttonStyle={{ backgroundColor: '#47d66d' }}
                          title="Save"
                          titleStyle={{ color: 'white' }}
                          onPress={() => {
                            this.confirmation("Save")
                          }
                          }
                        />
                      </View>

                      <View style={{ flex: 1, margin: 5 }}>
                        <Button
                          type="solid"
                          title="Back"
                          buttonStyle={{ backgroundColor: '#47d66d' }}
                          titleStyle={{ color: 'white' }}
                          onPress={() => { this.confirmation("Back") }}
                        />
                      </View>
                    </View>



                    </ScrollView>
            </View>)
        
    }
}

export default EditReportScreen;
