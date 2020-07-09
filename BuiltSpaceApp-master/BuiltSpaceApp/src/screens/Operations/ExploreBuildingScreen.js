import React, { Component } from "react";
import { ContextInfo } from "../../ContextInfoProvider";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    PermissionsAndroid,
} from "react-native";
import { get_building_data } from "../../storage/fetchAPI.js";
import SpacesModal from "./components/SpacesModal.js";
import AssetsModal from "./components/AssetsModal.js";
import {
    updateBuilding,
    DBcheckBuildingData,
    saveInspection,
    getInspections,
    insertQRCode,
} from "../../storage/schema/dbSchema";
import ChecklistModal from "./components/ChecklistModal.js";
import MaterialsType from "./components/MaterialsType.js";
import LabourType from "./components/LabourType.js";
import GeneralType from "./components/GeneralType.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";
import {
    getStartTime,
    formatInspectionObject,
    formatAddQuestion,
} from "../../functions/functions.js";
import { CameraKitCameraScreen } from "react-native-camera-kit";
import { CameraKitGalleryView } from "react-native-camera-kit";
import FlatlistFooter from "./components/ExploreBuildingFlatlistFooter";
import styles from "./BuildingScreen.style.js";
import Geolocation from "react-native-geolocation-service";
import { showMessage, hideMessage } from "react-native-flash-message";

export class ExploreBuildingScreen extends Component {

    static contextType = ContextInfo;
    constructor(props) {
        super(props);
        this.state = {
            qrcodes: [],
            mappingQr: false,
            isPermitted: false,
            spaces: [],
            assets: [],
            filteredAssets: [], // if space is selected, use this array to render the asset modal
            checklists: [],
            filteredChecklist: [], // this array is loaded into the checklist.
            dataLoaded: false,
            spaceSelected: false,
            spaceName: "",
            checklistSelected: false,
            checklistTitle: "",
            assetSelected: false,
            assetTitle: "",
            qrCodeValue: "",
            setQuestions: [], // set of questions based on the selected checklist.
            checklistId: "",
            disableSpace: false,
            disableChecklist: true,
            contactEmails: [],
            inputEmails: [],
            totalEmails: [],
            emailInput: "",
            DeviceGeolocation: {},
            assetSelected: false,
            assetTitle: '',
            assetModel: '',
            assetSerial: '',
            assetCategory: '',
            assetDescription: '',
            assetMake: '',
            assetPhysical: '',
            assetServices: '',
            assetID: '',
            startVisitAssets: [],
        };
        this.spacesFilter = this.spacesFilter.bind(this);
        this.assetsFilter = this.assetsFilter.bind(this);
        this.loadQuestions = this.loadQuestions.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.loadQRCode = this.loadQRCode.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
    }

    spacesFilter = (space) => {
        /*
      in spacesModal, this function will be called to update the state in this screen.
      When a space is selected, this function will run and
      sets the filters the assets state variable by comparing space.floor and asset.spaces properties
    */
        var filteredAssets = this.state.assets.filter(
            (item) => item.spaces === space.floor
        );
        var filteredChecklist = [];
        for (
            var checklist_index = 0;
            checklist_index < this.state.checklists.length;
            checklist_index++
        ) {
            if (this.state.checklists[checklist_index].assetCategory == "") {
                filteredChecklist.push(this.state.checklists[checklist_index]);
            }
            for (
                var asset_index = 0;
                asset_index < filteredAssets.length;
                asset_index++
            ) {
                if (
                    filteredAssets[asset_index].categoryabbr ==
                    this.state.checklists[checklist_index].assetCategory
                ) {
                    filteredChecklist.push(
                        this.state.checklists[checklist_index]
                    );
                }
            }
        }
        this.setState({
            selectedSpaceId: space.id,
            spaceSelected: true,
            filteredAssets,
            filteredChecklist,
        });
    };
    assetsFilter = (asset) => {
        /*
      in assetModal, this function will be called to update the state in this screen.
      When an asset is selected, this function will run and
      checks if a space is already selected to choose which checklist to filter.
      filters the checklist/filteredChecklist state variable by comparing checklist.assetCategory and asset.categoryabbr properties
    */
        if (this.state.spaceSelected) {
            var filteredChecklist = this.state.filteredChecklist.filter(
                (item) =>
                    item.assetCategory === asset.categoryabbr ||
                    item.assetCategory === ""
            );
            this.setState({
                selectedAssetId: asset.id,
                filteredChecklist,
                disableSpace: true,
            });
        } else {
            this.state.filteredChecklist = this.state.checklists.filter(
                (item) =>
                    item.assetCategory === asset.categoryabbr ||
                    item.assetCategory === ""
            );
            this.setState({
                selectedAssetId: asset.id,
                disableSpace: true,
            });
        }
    };


    loadQuestions = (questions, checklistId) => {
        /*
      sets the questions for the flatlist to render 
      in this Screen and assigns a state variable
      for the selected checklist id.
     */


        if (this.state.checklistSelected) {
            this.setState(
                {
                    checklistSelected: false,
                    disableChecklist: false,
                    StartTime: "",
                    setQuestions: [],
                    questionsLoading: true,
                },
                () => {
                    this.setNewQuestions(questions, checklistId);
                }
            );
        } else {
            {
                this.setNewQuestions(questions, checklistId);
            }
        }
    };

    setNewQuestions = (questions, checklistId) => {
        //
        var StartTime = getStartTime();
        this.setState({
            setQuestions: Array.from(questions),
            checklistSelected: true,
            checklistTitle: checklistId,
            StarTime: StartTime,
            checklistId,
            questionsLoading: false,
        });
    };
    updateQuestion = (
        index,
        value,
        type,
        measurement_label = "",
        measurement_unit = ""
    ) => {
        /*

      updates the question text input based on the type passed into the argument.
      
      This function will update the question based on the index loaded in the flatlist.

      There are checkers for each input text from the question and updates the property
      based on the type.
     */


        let question = this.state.setQuestions.slice(index, index + 1); // shallow copy the question from setQuestions
        if (type == "measurement") {
            question[0]["measurement_label"] = value;
            question[0]["measurement_unit"] = measurement_unit;
        }
        if (type == "TaskDetails") {
            question[0][type] = value;
        }
        if (type == "UnitCost") {
            question[0]["type"] = value;
        }
        if (type == "InspectionResults") {

            question[0]["InspectionResults"] = value
        }
        if (type == "Choices") {
            console.log("choices" + value);
            question[0]["Choices"] = value
        }
        if (type == "TextOnly") {
            question[0]["TextOnlyForm"] = value;
        }
        if (type == "Photos") {
            if (question[0]["Photos"] == undefined) {
                question[0]["Photos"] = [];
            }
            question[0]["Photos"].push(value);
        }
        if (type == "delete Photo") {
            question[0]["Photos"].splice(value, 1);
        }
        if (type == "crop Photos") {
            question[0]["Photos"] = value;
        }
    };
    resetState = () => {
        /*

      when refresh is pressed, this function will reset all assigned states.
     */
        this.setState({
            spaces: [],
            assets: [],
            filteredAssets: [],
            checklists: [],
            filteredChecklist: [],
            dataLoaded: false,
            spaceSelected: false,
            spaceName: '',
            checklistSelected: false,
            checklistTitle: '',
            assetSelected: false,
            assetTitle: '',
            assetMake: '',
            assetModel: '',
            assetSerial: '',
            assetDescription: '',
            assetCategory: '',
            assetPhysical: '',
            assetServices: '',
            assetID: '',
            qrCodeValue: '',
            setQuestions: [], // set of questions based on the selected checklist.
            checklistId: '',
            disableSpace: false,
            contactEmails: [],
            emailInput: '',
            inputEmails: [],
            totalEmails: [],
            startVisitAssets:[],
        })
    }

    onChange = (newState, text = null, make = null, model = null, serial = null, category = null,
        description = null, physical = null, services = null, id = null, type) => {

        /*
          when a space, asset or checklist type is selected, this function
          will assign a states based on the type.
          The modal components will change based on the states 
         */

        if (type == "checklist") {
            this.setState({
                checklistSelected: newState,
                checklistTitle: text,
                StartTime: '',
                setQuestions: []
            })
        }
        if (type == 'asset') {
            if (newState == false) {
                this.setState({
                    disableSpace: false
                })
            }
            this.setState({
                assetSelected: newState,
                assetTitle: text,
                assetMake: make,
                assetModel: model,
                assetSerial: serial,
                assetCategory: category,
                assetDescription: description,
                assetPhysical: physical,
                assetServices: services,
                assetID: id,
                checklistSelected: false,
                disableChecklist: false,
                StartTime: '',
                setQuestions: []
            })
        }

        if (type == 'space') {
            if (newState == false) {
                this.setState({
                    spaceSelected: newState,
                    StartTime: '',
                    disableChecklist: true,
                    checklistSelected: false,
                    assetSelected: newState,
                })
            } else {
                this.setState({
                    spaceSelected: newState,
                    spaceName: text,
                    StartTime: '',
                    disableChecklist: false,
                    assetSelected: false,
                    checklistSelected: false,
                })
            }
        }
    }




    componentDidMount = () => {
        var that = this;
        async function getLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message:
                            "BuiltSpace APP needs access to your Location permission ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    recordLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        }

        async function recordLocation() {
            try {
                await Geolocation.getCurrentPosition(
                    (position) => {
                        that.setState({
                            DeviceGeolocation: position.coords,
                        });
                    },
                    (error) => Alert.alert(error.message),
                    {
                        enableHighAccuracy: true,
                        timeout: 20000,
                        maximumAge: 1000,
                    }
                );
                that.watchID = Geolocation.watchPosition((position) => {
                    that.setState({
                        DeviceGeolocation: position.coords,
                    });
                    console.log("watch ID" + JSON.stringify(position));
                });
            } catch (err) {
                console.warn(err);
            }
        }

        getLocationPermission();
        this.loadData();
    };

    componentDidUpdate = (prevProps) => {
        const contactsCalledBack = this.props.navigation.state.params.contactsCallBack;
        if (prevProps.navigation.state.params.contactsCallBack !== contactsCalledBack) {
            this.loadEmail(contactsCalledBack);
        }
    };

    //Emailreport functions

    //Save the contacts called back from Contact.js, grab contactEmails and save in state.
    loadEmail = (contactsArray) => {
        var emailsCalledBack = [];

        for (const email of contactsArray) {
            emailsCalledBack = [
                ...emailsCalledBack,
                email.emailAddresses[0].email
            ];
        }
        this.setState({
            contactEmails: emailsCalledBack,
            totalEmails: emailsCalledBack.concat(this.state.inputEmails),
        });
    };

    //Function for add email textInput
    addEmail = (item) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.contactEmails.includes(item) || this.state.inputEmails.includes(item)) {
            Alert.alert("Email already added");
        } else {
            if (!reg.test(item)) {
                Alert.alert("Invalid Email ");
            } else {
                this.setState({
                    totalEmails: [...this.state.totalEmails, item],
                    inputEmails: [...this.state.inputEmails, item],
                });
            }
        }
    };



    //Function for remove a email from flatlist
    deleteEmail = (item) => {
        var newTotal = this.state.totalEmails;
        var newInput = this.state.inputEmails;
        var newContact = this.state.contactEmails;
        var index = newTotal.indexOf(item);
        var index2 = newInput.indexOf(item);
        var index3 = newContact.indexOf(item);
        // console.log(index,index2,index3)

        if (index !== -1) {
            newTotal.splice(index, 1)
        }

        if (index2 !== -1) {
            newInput.splice(index2, 1)
        }
        if (index3 !== -1) {
            newContact.splice(index3, 1);
        }
        this.setState({
            totalEmails: newTotal,
            inputEmails: newInput,
            contactEmails: newContact,
        });
    }

    componentWillUnmount = () => {
        Geolocation.clearWatch(this.watchID);
    };


    loadData = () => {
        /*
      on component did mount, this function will check if their
      is building data in realm db.
      if none, it will run the updateBuildingData function
      if it exists, the function will check the datetime if 1 hour has passed.
      if the time exeeds 1 hour from the last update, it will run
      the updateBulidingData function.
    */
        var currentDate = new Date(); // current datetime as object

        var orgData = this.props.navigation.state.params.orgData; // realm object from props
        var buildingData = this.props.navigation.state.params.buildingData; //realm object from props
        this.setState({ checklists: orgData.checklists }); //sets checklists

        DBcheckBuildingData(
            this.context.accountContext.account,
            orgData,
            buildingData
        ).then((result) => {
            if (!result) {
                this.updateBuildingData();
            } else {
                if (
                    result[0].lastUpdated !== undefined &&
                    result[0].lastUpdated !== null
                ) {
                    //get datetime of last updated organizations
                    //and add 1 hour to last updated time
                    var addHour = result[0].lastUpdated;
                    addHour.setHours(addHour.getHours() + 1);
                    
                     var filteredAssets;

                    //if direct from visit start
                    console.log("this.assetGroup"+this.props.navigation.state.params.assetGroup);
                    if(this.props.navigation.state.params.assetGroup!=undefined){
                       filteredAssets = result[0].assets.filter(
                            (item) => item.categoryabbr === this.props.navigation.state.params.assetGroup
                            );
                            console.log("this state.asset"+JSON.stringify(filteredAssets));
                            


                    }

                    // Check last updated timestamp is within 1 hour
                    if (this.context.networkContext.isConnected) {
                        if (currentDate < addHour) {
                            console.log(
                                "ExploreBuildingScreen load from database: " +
                                result[0].name
                            );
                            this.setState({
                                buildingLastUpdated: result[0].lastUpdated.toLocaleString(),
                                spaces: result[0].spaces,
                                assets: result[0].assets,
                                qrcodes: result[0].qrcodes,
                                checklists: orgData.checklists,
                                dataLoaded: true,
                            });
                            
                             if(this.props.navigation.state.params.assetGroup!=undefined){
                               console.log("123 underfine")
                                this.setState({
                                
                                    spaceSelected: true,
                                    filteredAssets,
                                });    
         
         
                             }
                        }

                        // Check network before fetching API
                        if (
                            currentDate >= addHour &&
                            this.context.networkContext.isConnected
                        ) {
                            this.updateBuildingData();
                        }
                    } else {
                        console.log(
                            "No network, ExploreBuildingScreen load from database: " +
                            result[0].name
                        );
                        this.setState({
                            buildingLastUpdated: result[0].lastUpdated.toLocaleString(),
                            spaces: result[0].spaces,
                            assets: result[0].assets,
                            qrcodes: result[0].qrcodes,
                            checklists: orgData.checklists,
                            dataLoaded: true,
                        });
                    }

                    // Check network before fetching API
                    if (
                        currentDate >= addHour &&
                        this.context.networkContext.isConnected
                    ) {
                        this.updateBuildingData();
                    }
                } else {
                    console.log(
                        "No network, ExploreBuildingScreen load from database: " +
                        result[0].name
                    );
                    this.setState({
                        buildingLastUpdated: result[0].lastUpdated.toLocaleString(),
                        spaces: result[0].spaces,
                        assets: result[0].assets,
                        qrcodes: result[0].qrcodes,
                        checklists: orgData.checklists,
                        dataLoaded: true,
                    });
                }
            }
        });
    };

    updateBuildingData = () => {
        /*
      The function will call get_building_data from fetchAPI.js
      and returns the building details as an array of objects
     */
        var orgData = this.props.navigation.state.params.orgData;
        var buildingData = this.props.navigation.state.params.buildingData; //realm object from props
        var currentDate = new Date(); // current datetime as object
        get_building_data(
            orgData,
            buildingData,
            this.context.accountContext.account.api_key
        ).then((api_result) => {
            console.log(
                "ExploreBulidingScreen update building data: " + api_result.name
            );
            var building_data = api_result;
            updateBuilding(
                this.context.accountContext.account,
                orgData.id,
                building_data,
                currentDate
            );
            this.setState({
                buildingLastUpdated: currentDate.toLocaleString(),
                spaces: api_result.spaces,
                assets: api_result.assets,
                checklists: orgData.checklists,
                dataLoaded: true,
            });
        });
    };

    saveAlert = () => {
        /**On button press to save inspection to device,
      will trigger this alert
     */
        Alert.alert(
            "Confirmation",
            "Are all the questions answered? " +
            "You will not be able to edit this inspection " +
            "after saving. Press OK to save to your device.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: "OK", onPress: () => this.saveToDevice() },
            ],
            { cancelable: true }
        );
    };

    saveToDevice = async () => {
        /*
    Confirmation from saveAlert will trigger this function to format the checklistObject
    and saves the object into realm db
     */


        console.log(this.state.DeviceGeolocation);
        if (this.state.spaceSelected) {
            var spaceSelected = this.state.spaceSelected;
            var spaceSelectedId = this.state.selectedSpaceId;
            var spaces = Array.from(this.state.spaces);
        }


        try {
            //runs the function formatInspectionObject from functions.js
            const checklistObject = formatInspectionObject(
                this.props.navigation.state.params.buildingData,
                this.state.assets.find(
                    (asset) => asset.id == this.state.selectedAssetId
                ),
                this.props.navigation.state.params.orgData,
                this.state.StartTime,
                this.state.GeneralComments,
                this.state.checklistId,
                this.state.checklistTitle,
                this.state.setQuestions,
                this.state.DeviceGeolocation,
                spaceSelected,
                spaceSelectedId,
                spaces,
                this.state.totalEmails,
            );
            saveInspection(
                this.context.accountContext.account,
                checklistObject
            );
        } catch (e) {
            console.log(e);
        }
    };

    renderFlatlistFooter = () => {
        return <FlatlistFooter addQuestion={this.addQuestion} />;
    };

    alertNotSelected = () => {
        Alert.alert(
            "Error",
            "Asset is not selected",
            [
                {
                    text: "Ok",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    submitInspection = async () => {
        console.log(this.state.DeviceGeolocation);
        getInspections(this.context.accountContext.account).then(result => {
            console.log(JSON.stringify(result, null, 1));
        });
    };

    loadQRCode = (
        mapping,
        url,
        type,
        type_name,
        typeid,
        filteredAssets = null,
        filteredChecklist
    ) => {
        if (mapping) {
            this.setState({ mappingQr: true, qrCodeValue: url });
        }

        if (type == "space") {
            this.setState({
                selectedSpaceId: typeid,
                spaceSelected: true,
                spaceName: type_name,
                disableSpace: true,
                disableChecklist: false,
                assetSelected: false,
                checklistSelected: false,
                StartTime: "",
                filteredAssets,
                filteredChecklist,
            });
        }

        if (type == "asset") {
            this.onChange(true, type_name, "asset");
            this.setState({
                assetSelected: true,
                assetTitle: type_name,
                spaceSelected: false,
                disableSpace: true,
                checklistSelected: false,
                disableChecklist: false,
                StartTime: "",
                selectedAssetId: typeid,
                setQuestions: [],
                filteredChecklist,
            });
        }
    };


    alertMappingSelected = (type, type_name, qrcode) => {
        Alert.alert(
            `${type} Selected`,
            `Map QR Code #${this.state.qrCodeValue} to ${type_name}?`,
            [
                {
                    text: "Cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        var orgData = this.props.navigation.state.params
                            .orgData; // realm object from props
                        var buildingData = this.props.navigation.state.params
                            .buildingData; //realm object from props
                        insertQRCode(
                            this.context.accountContext.account,
                            orgData,
                            buildingData,
                            qrcode
                        );
                        this.loadData();
                        this.setState({
                            mappingQr: false,
                        });

                        showMessage({
                            message: `QR Code ${
                                qrcode.url
                                } mapped to ${type}: ${type_name}.`,
                            type: "info",
                            color: "black",
                            floating: true,
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    buttonPress = (type) => {
        if (type == "Space") {
            if (this.state.spaceSelected) {
                const qrcode = {
                    id: null,
                    spaceid: this.state.selectedSpaceId,
                    assetid: null,
                    buildingid: this.props.navigation.state.params.buildingData
                        .id,
                    conractperson: null,
                    url: this.state.qrCodeValue,
                };

                this.alertMappingSelected(
                    "Space",
                    this.state.spaceName,
                    qrcode
                );
            } else {
                showMessage({
                    message: "No Space Selected.",
                    type: "info",
                    color: "black",
                    floating: true,
                });
            }
        } else if (type == "Asset") {
            if (this.state.assetSelected) {
                const qrcode = {
                    id: null,
                    spaceid: null,
                    assetid: this.state.selectedAssetId,
                    buildingid: this.props.navigation.state.params.buildingData
                        .id,
                    conractperson: null,
                    url: this.state.qrCodeValue,
                };
                this.alertMappingSelected(
                    "Asset",
                    this.state.assetTitle,
                    qrcode
                );
            } else {
                showMessage({
                    message: "No Asset Selected.",
                    type: "info",
                    color: "black",
                    floating: true,
                });
            }
        }
    };


    submitInspection = async () => {
        console.log(this.state.DeviceGeolocation);
        getInspections(this.context.accountContext.account).then((result) => {
            console.log(JSON.stringify(result, null, 1));
        });
    };

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "BuiltSpace Camera Permission",
                    message:
                        "BuiltSpace needs your permission to access the camera",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    render() {

        const noFilteredAssets = <AssetsModal assets={this.state.assets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange}
            assetSelected={this.state.assetSelected} assetTitle={this.state.assetTitle} assetMake={this.state.assetMake}
            assetModel={this.state.assetModel} assetSerial={this.state.assetSerial} assetCategory={this.state.assetCategory}
            assetDescription={this.state.assetDescription} assetPhysical={this.state.assetPhysical} assetServices={this.state.assetServices}
            assetID={this.state.assetID} />

        const yesFilteredAssets = <AssetsModal assets={this.state.filteredAssets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange}
            assetSelected={this.state.assetSelected} assetTitle={this.state.assetTitle} assetMake={this.state.assetMake}
            assetModel={this.state.assetModel} assetSerial={this.state.assetSerial} assetCategory={this.state.assetCategory}
            assetDescription={this.state.assetDescription} assetPhysical={this.state.assetPhysical} assetServices={this.state.assetServices}
            assetID={this.state.assetID} />

        const startVisitAssets = <AssetsModal assets={this.state.startVisitAssets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange}
            assetSelected={this.state.assetSelected} assetTitle={this.state.assetTitle} assetMake={this.state.assetMake}
            assetModel={this.state.assetModel} assetSerial={this.state.assetSerial} assetCategory={this.state.assetCategory}
            assetDescription={this.state.assetDescription} assetPhysical={this.state.assetPhysical} assetServices={this.state.assetServices}
            assetID={this.state.assetID} />

        const yesFilteredChecklist = (
            <ChecklistModal
                checklists={this.state.filteredChecklist}
                loadQuestions={this.loadQuestions}
                checklistSelected={this.state.checklistSelected}
                onChecklistChange={this.onChange}
                checklistTitle={this.state.checklistTitle}
                disableChecklist={this.state.disableChecklist}
            />
        );

        const noFilteredChecklist = (
            <ChecklistModal
                checklists={this.state.checklists}
                loadQuestions={this.loadQuestions}
                checklistSelected={this.state.checklistSelected}
                onChecklistChange={this.onChange}
                checklistTitle={this.state.checklistTitle}
                disableChecklist={this.state.disableChecklist}
            />
        );

        const qrScanner = (
            <TouchableOpacity
                onPress={() => {
                    this.requestCameraPermission();
                    this.props.navigation.navigate("QRCode", {
                        loadQRCode: this.loadQRCode,
                        checklists: this.state.checklists,
                        spaces: this.state.spaces,
                        assets: this.state.assets,
                        qrcodes: this.props.navigation.state.params.buildingData
                            .qrcodes,
                    });
                }}
            >
                <View style={styles.row}>
                    <Text style={styles.text}>Scan Qr</Text>
                    <View>
                        <Icon
                            style={styles.listIcon}
                            name="angle-right"
                            size={30}
                            color="black"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );

        const mappingBanner = (
            <View style={styles.bannerContainer}>
                <Text>
                    You scanned a blank QR Code (#{this.state.qrCodeValue})
                </Text>

            </View>
        );

        const mapButton = (str) => {
            return (
                <View style={styles.centerWrapper}>
                    <Button
                        buttonStyle={styles.mapButton}
                        title={`Assign QR`}
                        onPress={this.buttonPress.bind(this, str)}
                    />
                </View>
            );
        };

        if (!this.state.dataLoaded) {
            return (
                <View>
                    <ActivityIndicator />
                    <Text>Loading...</Text>
                </View>
            );
        } else if (this.state.dataLoaded) {
            const materialQ = this.state.setQuestions.filter(function (
                question
            ) {
                return question.questiontype === "Materials";
            });

            return (
                <ScrollView style={{ flex: 1 }}>
                    {this.state.mappingQr ? mappingBanner : <></>}
                    <View style={styles.select_container}>
                        <Text style={styles.selectText}>
                            Connection status:{" "}
                            {this.context.networkContext.isConnected
                                ? "online"
                                : "offline"}
                        </Text>
                        <Text style={styles.selectText}>
                            Logged in as:{" "}
                            {this.context.accountContext.account.email}
                        </Text>
                        <Text style={styles.selectText}>
                            Building last updated on:{" "}
                            {this.state.buildingLastUpdated}
                        </Text>
                
                 <Text style={styles.selectText}>
                                Location Information: {" "}
                               
                            </Text>
                            <Text style={styles.selectText}>
                                Longitude: {" "}
                                {this.state.DeviceGeolocation.longitude}
                            </Text>
                            <Text style={styles.selectText}>
                                Latitude: {" "}
                                {this.state.DeviceGeolocation.latitude}
                                {"                "}
                                Altitude: {" "}
                                {this.state.DeviceGeolocation.altitude}
                            </Text>
                
                        <View style={{ flexDirection: "row" }}>
                            <View style={this.context.networkContext.isConnected ? styles.refreshBtn : styles.refreshBtnGreyed}>
                                <Icon
                                    onPress={() => {
                                        this.setState({ dataLoaded: false });
                                        this.resetState();
                                        this.updateBuildingData();
                                    }}
                                    name="refresh"
                                    size={26}
                                    color="white"
                                />
                            </View>
                            <Text> Reload Data</Text>
                            {this.state.mappingQr ? (
                                <View style={styles.centerWrapper}>
                                    <Button
                                        buttonStyle={styles.cancelButton}
                                        title={"Stop Mapping"}
                                        onPress={() => {
                                            this.setState({ mappingQr: false })
                                        }}
                                    />
                                </View>
                            ) : (
                                    <></>
                                )}
                        </View>
                    </View>

                    <View>
                        <SpacesModal
                            disableSpace={this.state.disableSpace}
                            spaces={this.state.spaces}
                            spacesFilter={this.spacesFilter}
                            onSpaceChange={this.onChange}
                            spaceSelected={this.state.spaceSelected}
                            spaceName={this.state.spaceName}
                        />

                        {this.state.mappingQr ? mapButton("Space") : <></>}

                        {this.state.spaceSelected
                            ? yesFilteredAssets
                            : noFilteredAssets}

                        {this.state.mappingQr ? mapButton("Asset") : <></>}

                        {this.state.spaceSelected
                            ? yesFilteredChecklist
                            : this.state.assetSelected
                                ? yesFilteredChecklist
                                : noFilteredChecklist}

                        <View style={{ paddingBottom: 20 }}>
                            {this.state.questionsLoading ? null : this.state
                                .checklistSelected ? (
                                    <View>
                                        <Text style={styles.questionsHeader}>
                                            Questions
                                    </Text>

                                        <FlatList
                                            style={styles.flatList}
                                            data={this.state.setQuestions}
                                            extraData={this.state.setQuestions}
                                            ListFooterComponent={
                                                this.renderFlatlistFooter
                                            }
                                            renderItem={({ item, index }) => {
                                                if (item.questiontype === "") {
                                                    return (
                                                        <GeneralType
                                                            navigation={
                                                                this.props
                                                                    .navigation
                                                            }
                                                            question={{
                                                                item,
                                                                index,
                                                                updateQuestion: this
                                                                    .updateQuestion,
                                                            }}
                                                        />
                                                    );
                                                }

                                                if (
                                                    item.questiontype === "Labour"
                                                ) {
                                                    return (
                                                        <LabourType
                                                            navigation={
                                                                this.props
                                                                    .navigation
                                                            }
                                                            question={{
                                                                item,
                                                                index,
                                                                updateQuestion: this
                                                                    .updateQuestion,
                                                            }}
                                                        />
                                                    );
                                                }

                                                if (
                                                    item.questiontype ===
                                                    "Materials"
                                                ) {
                                                    return (
                                                        <MaterialsType
                                                            navigation={
                                                                this.props
                                                                    .navigation
                                                            }
                                                            question={{
                                                                item,
                                                                index,
                                                                updateQuestion: this
                                                                    .updateQuestion,
                                                            }}
                                                        />
                                                    );
                                                }
                                            }}
                                            keyExtractor={(item) =>
                                                this.state.setQuestions.indexOf(
                                                    item
                                                )
                                            }
                                        />

                                        <View
                                            style={{
                                                flex: 2,
                                                flexDirection: "column",
                                                margin: 15,
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text>Additional Comments</Text>
                                                <TextInput
                                                    style={{
                                                        borderWidth: 1,
                                                        borderColor: "black",
                                                        backgroundColor: "white",
                                                    }}
                                                    multiline
                                                    numberOfLines={4}
                                                    textAlignVertical={"top"}
                                                    onChangeText={(text) =>
                                                        this.setState({
                                                            GeneralComments: text,
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 2,
                                                flexDirection: "column",
                                                margin: 15,
                                                marginHorizontal: 10,
                                            }}
                                        >
                                            <TextInput
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        emailInput: text,
                                                    });
                                                }}
                                                placeholder="Add email here"
                                            />
                                            <Button
                                                type="solid"
                                                title="Add"
                                                buttonStyle={{
                                                    backgroundColor: "#47d66d",
                                                }}
                                                titleStyle={{ color: "white" }}
                                                onPress={() => {
                                                    this.addEmail(
                                                        this.state.emailInput
                                                    );
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate("ContactList", {
                                                    exploreEmails: this.state.contactEmails,
                                                    inputEmails: this.state.inputEmails,
                                                })}>
                                                <Icon name='address-book' size={40} />
                                            </TouchableOpacity>
                                            <FlatList
                                                data={this.state.totalEmails}
                                                renderItem={({ item }) => (
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: "row",
                                                        }}
                                                    >
                                                        <Text>{`${item}`}</Text>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.deleteEmail(
                                                                    item
                                                                );
                                                            }}
                                                        >
                                                            <Icon
                                                                name="trash"
                                                                size={20}
                                                                style={{
                                                                    paddingLeft: 10,
                                                                }}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flex: 3,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                margin: 5,
                                            }}
                                        >
                                            <View style={{ flex: 1, margin: 5 }}>
                                                <Button
                                                    style={{ flex: 1, margin: 5 }}
                                                    type="solid"
                                                    buttonStyle={{
                                                        backgroundColor: "#47d66d",
                                                    }}
                                                    title="Save to device"
                                                    titleStyle={{ color: "white" }}
                                                    onPress={() => {
                                                        if (
                                                            this.state.assetSelected
                                                        ) {
                                                            this.saveAlert();
                                                        } else {
                                                            this.alertNotSelected();
                                                        }
                                                    }}
                                                />
                                            </View>

                                            <View style={{ flex: 1, margin: 5 }}>
                                                <Button
                                                    type="solid"
                                                    title="Submit"
                                                    buttonStyle={{
                                                        backgroundColor: "#47d66d",
                                                    }}
                                                    titleStyle={{ color: "white" }}
                                                    onPress={() => {
                                                        getInspections(
                                                            this.context
                                                                .accountContext
                                                                .account
                                                        ).then((result) => {
                                                            console.log(
                                                                JSON.stringify(
                                                                    result,
                                                                    null,
                                                                    1
                                                                )
                                                            );
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                margin: 5,
                                                marginBottom: 5,
                                            }}
                                        >
                                            <Button
                                                title="Home"
                                                onPress={() =>
                                                    this.props.navigation.navigate(
                                                        "Home"
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                ) : null}

                            {this.state.mappingQr ? <></> : qrScanner}
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }
}

export default ExploreBuildingScreen;
