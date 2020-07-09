import React, {Component} from 'react';
import {Alert, View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Button} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker'
import * as RNFS from 'react-native-fs'

export class LabourType2 extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: null,
            format: this.props.question.item.QuestionFormat.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
            pictureArray: [],
            renderList: false,
          
            detailtext:"",
            measurementUnit2:""
        }
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    this.updatePictureArray = this.updatePictureArray.bind(this)
    this.cropPicture = this.cropPicture.bind(this)
    this.deletePicture = this.deletePicture.bind(this)
    }

   

    buttonComponents = () => {
        var buttons = []
        this.state.format.forEach((button,index) => {
           buttons.push({element:  () => <Text style={this.changeColor(index)}>{button}</Text>})
           //buttons.push({element:  () => <Text >{button}</Text>})
        })
        return buttons
    }

    changeColor = (index) => {
        if (this.state.selectedIndex == index) {
            return { textAlign: 'center', borderColor: this.state.colors[index], color : 'white'}
        } else {
            return { textAlign: 'center', borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }
    
    updateIndex(selectedIndex) {
            this.setState({selectedIndex})
            this.props.question.updateQuestion(this.props.question.index, this.state.format[selectedIndex], "InspectionResults")
            this.props.question.updateQuestion(this.props.question.index, selectedIndex, "Choices")
    }
    // This function has a setState in it with nothing to reset/refresh the state for the array of pitures
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
            this.setState({ pictureArray: editedPics })
          });
          this.setState({
              renderList: true
          })
    }

    deletePicture(uri, index) {

        this.state.pictureArray.splice(index, 1)

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
                <Text style={{fontWeight: "bold"}}>{question.TaskTitle} </Text>
                {question.remarks !== "" ?
                <Text style={{fontStyle: "italic"}}>{question.remarks}</Text>
                : 
                null}
                {!question.measurementonly ?
                    (!question.textonly ? 
                        <ButtonGroup
                        // selectedButtonStyle={{
                        //     backgroundColor: this.state.colors[this.state.selectedIndex==null?parseInt(question.Choices):this.state.selectedIndex]
                        // }}
                        buttonStyle={{padding: 5}}
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
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "TextOnly", // type 
                            )}
                        />)
                    :null}
                {question.showmeasurement 
                || question.measurementonly
                || question.QuestionType === "Labour" ?
                    <View style={{flex:2}}>
                        {question.measurementlabel !== "" ?
                          
                            <Text>Labour:</Text>
                            
                            :
                            <Text>Labour:</Text>}

                        <View style={{flex: 2, flexDirection: 'row'}}>
                        <TextInput 
                        style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'white', borderWidth: 1 }}
                        defaultValue={question.measurementUnit2}
                        onChangeText={(measurementUnit2) =>{

                    this.setState({ measurementUnit2 })
                    this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            measurementUnit2, // text input
                            "measurementUnit2", // type 
                            "hours" // measurement label
                            )}
                        }

                        />
                      
                            <Text style={{marginTop: 10, marginLeft: 4}}> Hours </Text>
                        </View>
                    </View>
                    :null}
                <View style={{flex: 2, flexDirection: "row"}}>
                </View>
                <View style={{flex:2}}>
                    <Text>Details: </Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                   defaultValue={question.TaskDetails}
                    onChangeText={(detailtext) => {
                        this.setState({ detailtext })
                        this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        detailtext, // text input
                        "TaskDetails", // type 
                        )}}
                    />
                </View>
                <View style={{flex:1, margin: 5}}>
                        <Button
                        type='solid'
                            title="Upload picture"
                            buttonStyle={{backgroundColor: '#47d66d'}}
                            titleStyle={{color: 'white'}}
                           onPress={() => this.props.navigation.navigate('CameraComponent', {
                                updatePictureArray: this.updatePictureArray
                            })}
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


export default LabourType2