import React, {Component} from 'react';
import {StyleSheet, Alert, PermissionsAndroid, Platform} from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';

export default class CameraComponent extends Component {

    static navigationOptions = {
        headerShown: false
    }

   
    constructor(props) {
        super(props);
        this.state = { 
            isPermitted: false ,
            picsArray: []
        }
    }
    componentDidMount() {
        var that = this;
        if (Platform.OS === 'android') {
        async function requestCameraPermission() {
            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                title: 'CameraExample App Camera Permission',
                message: 'CameraExample App needs access to your camera ',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //If CAMERA Permission is granted
                //Calling the WRITE_EXTERNAL_STORAGE permission function
                requestExternalWritePermission();
            } else {
                alert('CAMERA permission denied');
            }
            } catch (err) {
            alert('Camera permission err', err);
            console.warn(err);
            }
        }
        async function requestExternalWritePermission() {
            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                title: 'CameraExample App External Storage Write Permission',
                message:
                    'CameraExample App needs access to Storage data in your SD Card ',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //If WRITE_EXTERNAL_STORAGE Permission is granted
                //Calling the READ_EXTERNAL_STORAGE permission function
                requestExternalReadPermission();
            } else {
                alert('WRITE_EXTERNAL_STORAGE permission denied');
            }
            } catch (err) {
            alert('Write permission err', err);
            console.warn(err);
            }
        }
        async function requestExternalReadPermission() {
            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                title: 'CameraExample App Read Storage Read Permission',
                message: 'CameraExample App needs access to your SD Card ',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //If READ_EXTERNAL_STORAGE Permission is granted
                //changing the state to re-render and open the camera
                //in place of activity indicator
                that.setState({ isPermitted: true });
            } else {
                alert('READ_EXTERNAL_STORAGE permission denied');
            }
            } catch (err) {
            alert('Read permission err', err);
            console.warn(err);
            }
        }
        //Calling the camera permission function
        requestCameraPermission();
        } else {
        this.setState({ isPermitted: true });
        }
    }
    onBottomButtonPressed(event) {
        if (event.type === 'left') {
        this.setState({ isPermitted: false });
        this.props.navigation.goBack()
        } 
        else if (event.type === 'right') {
        this.setState({ isPermitted: false })
        this.props.navigation.goBack()
        }
        else {
        Alert.alert(
            "Picture Taken",
            "Use this picture?",
            [
                { text: 'YES', onPress: () => {
                    this.state.picsArray.push(event.captureImages[0].uri)
                    this.props.navigation.state.params.updatePictureArray(this.state.picsArray)
                    this.props.navigation.goBack()
                } },
                {text: 'NO', onPress: ()=> console.log('Cancel pressed')}
            
            ],
            { cancelable: false }
        );
        }
    }
    render() {
        if (this.state.isPermitted) {
        return (
            <CameraKitCameraScreen
            // Buttons to perform action done and cancel
            actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
            onBottomButtonPressed={event => this.onBottomButtonPressed(event)}
            flashImages={{
                // Flash button images
                on: require('../../assets/flashon.png'),
                off: require('../../assets/flashoff.png'),
                auto: require('../../assets/flashauto.png'),
            }}
            cameraFlipImage={require('../../assets/flip.png')}
            captureButtonImage={require('../../assets/capture2.png')}
            />
        );
        }
        else {
            return null
        } 
    }
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
    });