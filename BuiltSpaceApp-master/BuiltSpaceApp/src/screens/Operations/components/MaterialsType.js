import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Alert, View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Button} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker'
import * as RNFS from 'react-native-fs'
import Modal from 'react-native-modal';
// import DialogInput from 'react-native-dialog-input';
// import Prompt from 'react-native-prompt-crossplatform';

export class MaterialsType extends Component {
    constructor(props) {
        super(props);
        this.state={
            promptArray:[],
            promptValue:'',
            selectedIndex: 0,
            format: this.props.question.item.format.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
            pictureArray: [],
            renderList: false,
            cameraImage: null,
            cameraPicsArray: [],
            libraryImage: null,
            libraryPicsArray: [],
            textValue: ""
        }
       
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    this.updatePictureArray = this.updatePictureArray.bind(this)
    this.addPromptArray = this.addPromptArray.bind(this)
    this.updatePromptArray = this.updatePromptArray.bind(this)
    this.cropPicture = this.cropPicture.bind(this)
    this.deletePicture = this.deletePicture.bind(this)
    this.uploadFromLibrary = this.uploadFromLibrary.bind(this)
    this.uploadFromCamera = this.uploadFromCamera.bind(this)
    this.textChange = this.textChange.bind(this)
    }

    textChange() {
    
      this.state.promptArray.push( this.state.textValue.toString() );
      console.log(this.state.promptArray)
    }

    state = {
        isModalVisible: false,
    };
     
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };

    addPromptArray(textVerma) {
        const obj = {textVerma} 
       // this.props.question.updateQuestion(this.props.question.index, obj, "Photos")
       this.state.promptArray.push(obj)
       console.log(obj)
    }

    updatePromptArray(text, index) {
        const editedPrompt = [...this.state.promptArray]
        editedPics[index] = {text}
        //.props.question.updateQuestion(this.props.question.index, editedPics, "crop Photos")
        this.setState({ promptArray: editedPrompt })
      
      this.setState({
          renderList: true
      })
    }
    

    

    buttonComponents = () => {
        var buttons = []
        this.state.format.forEach((button,index) => {
            buttons.push({element:  () => <Text style={this.changeColor(index)}>{button}</Text>})
        })
        return buttons
    }

    changeColor = (index) => {
        if (this.state.selectedIndex == index) {
            return { textAlign: "center", borderColor: this.state.colors[index], color : 'white'}
        } else {
            return { textAlign: "center", borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }

    

    updateIndex(selectedIndex) {
        this.setState({selectedIndex})
        this.props.question.updateQuestion(this.props.question.index, this.state.format[selectedIndex], "InspectionResults")
        this.props.question.updateQuestion(this.props.question.index, selectedIndex, "Choices")
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

    uploadFromLibrary() {
        ImagePicker.openPicker({
            mediaType: "photo",
            multiple: true
        }).then(images => {
            console.log("Selected Pictures from picker" + images)

            this.setState({
                libraryImage: images.map(i => {
                    console.log('received image', i);
                    return {uri: i.path}
                })
            })
            console.log(this.state.libraryImage)

            Object.keys(this.state.libraryImage).map(i => {
                console.log("Image: " + this.state.libraryImage[i])

                this.state.libraryPicsArray.push(this.state.libraryImage[i].uri)
                console.log("Array" + this.state.libraryPicsArray)

                this.updatePictureArray(this.state.libraryPicsArray)

                this.setState({
                    libraryPicsArray: []
                })
            })

            // for single image

            // this.state.libraryPicsArray.push(this.state.libraryImage.uri)
            // console.log(this.state.libraryPicsArray)

            // this.updatePictureArray(this.state.libraryPicsArray)

            // this.setState({
            //     libraryPicsArray: []
            // })
            
        });
    }

    uploadFromCamera() {
        ImagePicker.openCamera({
            mediaType: "photo",
            width: 300,
            height: 400,
            cropping: true
        }).then(images => {

            this.setState({
                cameraImage: {uri: images.path}
            })
            console.log("camera image" + this.state.cameraImage)
            
            this.state.cameraPicsArray.push(this.state.cameraImage.uri)
            console.log("Array" + this.state.cameraPicsArray)
            
            this.updatePictureArray(this.state.cameraPicsArray)

            this.setState({
                cameraPicsArray: []
            })
        });
    }

    

    render() {
        
        const buttonArray = this.buttonComponents()
        const { selectedIndex } = this.state
        const question = this.props.question.item
        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text style={{fontWeight: "bold"}}>{question.question}</Text>
                {question.remarks !== "" ?
                <Text style={{fontStyle: "italic"}}>{question.remarks}</Text>
                : 
                null}
                {!question.measurementonly ?
                    (!question.textonly ? 
                        <ButtonGroup
                        selectedButtonStyle={{backgroundColor: this.state.colors[this.state.selectedIndex]}}
                        buttonStyle={{padding: 5}}
                        selectMultiple={false}
                        buttons={buttonArray}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        />
                        :
                        <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "TextOnly", // type 
                            )}
                        />
                        )
                    :
                    null}

                <View style={{flex: 2, flexDirection: "row"}}>
                {question.showmeasurement 
                || question.measurementonly
                || question.questiontype === "Labour" ?
                <View style={{flex:2}}>

                {question.measurementlabel !== "" ?
                        <Text>{question.measurementlabel}</Text>
                        :
                        <Text>Measurement</Text>}
                        <TextInput 
                        style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'white', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "measurement", // type 
                            this.props.question.item.measurementlabel, // measurement label
                            )}
                        />
                </View>
                :
                null}
                <View style={{flex:2}}>
                    <Text style={{marginLeft: 5}}>Unit Cost</Text>
                    <TextInput 
                    style={{ flex:1, margin: 4, height: 40, backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={text => this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        text, // text input
                        "UnitCost", // type 
                        )}
                    />
                </View>
                </View>
                <View style={{flex:2}}>
                    <Text>Details: </Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'white', borderWidth: 1 }}
                    onChangeText={text => this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        text, // text input
                        "TaskDetails", // type 
                        )}
                    />

                </View>
                <View style={{flex:1, margin: 5}}>
                         {/* <Button
                            title="Upload picture"
                            buttonStyle={{backgroundColor: '#47d66d'}}
                            titleStyle={{color: 'white'}}
                           onPress={() => this.props.navigation.navigate('CameraComponent', {
                                updatePictureArray: this.updatePictureArray
                                
                            })}
                        ></Button> */}
                        <Button
                            type='solid'
                            title="Upload Picture"
                            buttonStyle={{backgroundColor: '#47d66d'}}
                            titleStyle={{color: 'white'}}
                            // onPress={() => this.props.navigation.navigate('CameraComponent', {
                            //     updatePictureArray: this.updatePictureArray
                            // })}
                            onPress={this.toggleModal}>
                        </Button>

                        <Modal
                            style={modalStyles.modalContent} 
                            isVisible={this.state.isModalVisible}
                            onBackdropPress={this.toggleModal}
                            onPress={this.toggleModal}
                            animationIn="zoomIn"
                            animationInTiming={600}
                            >
                                <View style={modalStyles.modalBackground}>
                                   
                                    <Text style={modalStyles.modalTitle}>Choose Image</Text>
                                    <Text style={modalStyles.modalSubTitle}>From Library or Camera?</Text>
                                     

                                    <TouchableOpacity style={modalStyles.modalButton} onPressOut={this.toggleModal} onPress={this.uploadFromLibrary}>
                                        <Text style={modalStyles.modalButtonText}>Library</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={modalStyles.modalButton} onPressOut={this.toggleModal}  onPress={() => this.props.navigation.navigate('CameraComponent', {
                                        updatePictureArray: this.updatePictureArray})}>
                                            <Text style={modalStyles.modalButtonText}> Camera</Text>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={modalStyles.modalButton} onPressOut={this.toggleModal} onPress={this.uploadFromCamera}>
                                        <Text style={modalStyles.modalButtonText}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={modalStyles.modalButton} onPressOut={this.toggleModal} onPress={this.toggleModal}>
                                        <Text style={modalStyles.modalButtonText}>Cancel</Text>    
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                    
                        
  
                        
    
                         
                    
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
                    style={{width: 150, height: 150, marginRight: 5, marginTop: 5, overflow: 'hidden'}}
                    source={{ uri: item.uri}}></Image>
                     <TextInput
                        style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
                        placeholder="Add optional caption"
                        onChangeText={TextInputValue => this.setState({ textValue : TextInputValue }) }
                        />
                        {/* <Button
                         style={{width: 150}} 
                            title="Submit" 
                            onPress={this.textChange} /> */}
{/* 
                    <Text>{this.state.promptArray[index]} </Text> */}
                   
         
     

             
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


const modalStyles = StyleSheet.create({
    modalContent: {
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 5,
        textAlign: 'center'
    },
    modalSubTitle: {
        fontSize: 15,
        marginBottom: 26,
        textAlign: 'center',
    },
    modalBackground: {
        backgroundColor: "white",
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 15
    },
    modalButton: {
        alignItems: "center"
    },
    modalButtonText: {
        textAlign: "center",
        padding: 18,
        color: 'rgb(0, 0, 238)',
        fontSize: 17.5,
        borderColor: 'black',
        borderTopWidth: .3,
        width: '100%'
    }

})

export default MaterialsType
