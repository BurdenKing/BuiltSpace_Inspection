import React, {Component} from 'react';
import {Alert, View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Button} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
// import CameraComponent from './CameraComponent.js'
// import ImageEditor from "@react-native-community/image-editor";
import ImagePicker from 'react-native-image-crop-picker'
import * as RNFS from 'react-native-fs'

const dirPictures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`

export class GeneralType2 extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: null,
            format: this.props.question.item.QuestionFormat.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
            pictureArray: [],
            renderList: false,
            detailInput:null,
            searchtext: "",
            textOnlyForm:""
        }

        
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    this.updatePictureArray = this.updatePictureArray.bind(this)
    this.cropPicture = this.cropPicture.bind(this)
    this.deletePicture = this.deletePicture.bind(this)
    }
   
componentDidMount(){
    
}

    buttonComponents = () => {
        var buttons = []
        this.state.format.forEach((button,index) => {
            buttons.push({element:  () => 
            <Text style={this.changeColor(index)}>{button}</Text>
           // <Text >{button}</Text>
        })
        })
        return buttons
    }

    changeColor = (index) => {
        if (this.state.selectedIndex == index) {
            return {textAlign: "center", borderColor: this.state.colors[index], color : 'white'}
        } else {
            return {textAlign: "center", borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }
    
    updateIndex(selectedIndex) {
        // console.log("select Index   =========================="+selectedIndex);
        // console.log("this.state.selectIndex    =========================="+this.state.selectedIndex);
        if (selectedIndex == this.state.selectedIndex){
            this.setState({selectedIndex: null})
            this.props.question.updateQuestion(this.props.question.index, "", "InspectionResults")
            this.props.question.updateQuestion(this.props.question.index, "", "Choices")
        }else{
            this.setState({selectedIndex})
            this.props.question.updateQuestion(this.props.question.index, this.state.format[selectedIndex], "InspectionResults")
         this.props.question.updateQuestion(this.props.question.index, selectedIndex, "Choices")

        }
    }

    updateInput(value){
        //    console.log("detail input============"+value);
        //    console.log("this.state.detailInput=========="+this.state.detailInput);
            this.setState({value});
       //     this.props.question.updateQuestion(this.props.question.index, value, "TaskDetails")
    }
    updatePictureArray(uri) {
        const obj = {uri: `file://${uri[0]}`} 
        this.props.question.updateQuestion(this.props.question.index, obj, "Photos")
       this.state.pictureArray.push(obj)
       this.setState({
            renderList: true
        })
    }

    cropPicture(uri, index) {
        ImagePicker.openCropper({
            path: uri,
            width: 300,
            height: 400
          }).then(image => {
            const editedPics = [...this.state.pictureArray]
            editedPics[index] = {uri: image.path}
            this.props.question.updateQuestion(this.props.question.index, editedPics, "crop Photos")
            this.setState({ pictureArray: editedPics })
          });
          this.setState({
              renderList: true
          })
    }

    deletePicture(uri, index) {

        this.state.pictureArray.splice(index, 1)
        this.props.question.updateQuestion(this.props.question.index, index, "delete Photos")
        const filepath = `${uri}`
        RNFS.exists(filepath)
        .then((result)=> {
            if (result) {
                return RNFS.unlink(filepath)
                .then(() => {
                    console.log('File deleted')
                })
                // unlink will throw an error if the picture doesn't exist
                .catch((err) => {
                    console.log(err.message)
                })
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
        this.setState({
            renderList: true
        })
    }
  
    render() {
        
        const buttonArray = this.buttonComponents()
        const { selectedIndex } = this.state
        const question = this.props.question.item
        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text style={{fontWeight: "bold"}}>{question.QuestionNumber}. {question.TaskTitle}</Text>
                {question.remarks !== "" ?
                <Text style={{fontStyle: "italic"}}>{question.remarks} </Text>
                : 
                null}
                {!question.measurementonly ?
                    (!question.textonly ? 
                        <ButtonGroup
                       selectedButtonStyle={{
                        backgroundColor: this.state.colors[this.state.selectedIndex==null?parseInt(question.Choices):this.state.selectedIndex]
                      // backgroundColor: this.state.colors[selectedIndex]
                          
                        }}
                        buttonStyle={{padding: 5}}
                        textStyle={{textAlign: "center"}}
                        selectMultiple={false}
                        buttons={buttonArray}
                        onPress={this.updateIndex}
                        selectedIndex={
                            selectedIndex==null?parseInt(question.Choices):selectedIndex
                          
                        }
                       
                         underlayColor={'red'}
                        />
                        :
                        <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                        label="test"
                        
                        />)
                    :
                    null}

                <View style={{flex: 2, flexDirection: "row"}}>
                {question.showmeasurement || question.measurementonly ?
                <View style={{flex:2}}>
                {question.measurementLabel !== "" ?
                        <Text>{question.measurementLabel} </Text>
                        :
                        <Text>Measurement </Text>}
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <TextInput 
                            style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                            defaultValue={question.textOnlyForm}
                            onChangeText={textOnlyForm => {
                                this.setState({ textOnlyForm })
                                this.props.question.updateQuestion(
                                this.props.question.index, // index of the question
                                textOnlyForm, // text input
                                "TextOnly", // type 
                                this.props.question.measurementunit
                                )
                            }
                            }
                            />
                            <Text style={{marginTop: 10, marginLeft: 4}}>{question.measurementUnit}</Text>
                        </View>
                </View>
                :
                null}
                </View>
                <View style={{flex:2}}>
                    <Text>Details: </Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1, borderColor: 'grey' }}
                   defaultValue={question.TaskDetails}
                  onChangeText={(searchtext) => {
                      var value2=searchtext;
                    //   console.log("searchtext===="+searchtext);
                    //   console.log("this.searchtext"+this.state.searchtext)
                    this.setState({ searchtext })
                    this.props.question.updateQuestion(this.props.question.index, value2, "TaskDetails")
                  }
                }
                    />
                </View>
                <View style={{flex:1, margin: 5}}>
                        <Button
                        buttonStyle={{backgroundColor: '#47d66d'}}
                        titleStyle={{color: 'white'}}
                            title="Upload picture"
                           onPress={() => {
                            //    this.props.navigation.navigate('CameraComponent', {
                            //     updatePictureArray: this.updatePictureArray
                            // } )
                        }
                        }
                        ></Button>
                    
                     <FlatList style={{flex: 1}}
                    horizontal
                    style={{backgroundColor: 'white'}}
                    extraData={this.state.pictureArray}
                    data={this.state.pictureArray}
                    renderItem={({item, index}) =>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            'Edit Picture',
                            'Do you want to delete or edit this Picture?',
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel'},
                              {text: 'Edit Image', onPress: () => this.cropPicture(item.uri, index)},
                              {text: 'Delete Image', onPress: () => this.deletePicture(item.uri, index)},
                            ],
                            { cancelable: false }
                          )
                            }}>
                    <View>
                    
                    <Image
                    style={{width: 100, height: 100, marginRight: 5, marginTop: 5, overflow: 'hidden'}}
                    source={{ uri: item.uri}}></Image>
                    </View>
                    </TouchableOpacity>
                    }
                    keyExtractor={item => this.state.pictureArray.indexOf(item)}
                    />  
                    
                   </View>
                   
            </View>
        )
    }
}

export default GeneralType2