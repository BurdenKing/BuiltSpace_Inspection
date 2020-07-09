import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
} from "react-native";
import { CameraKitCameraScreen } from "react-native-camera-kit";
import { loadQRMapping } from "../../functions/functions.js";
import { ContextInfo } from "../../ContextInfoProvider";
import { insertQRCode } from "../../storage/schema/dbSchema";
import { showMessage, hideMessage } from "react-native-flash-message";

class QRCodeComponent extends Component {
    static contextType = ContextInfo;

    constructor(props) {
        super(props);
        this.state = {
            qrvalue: "",
            scan: true,
        };
    }

    componentDidMount = () => {
        this.openQRCodeScanner;
    };

    openQRCodeScanner = () => {
        var that = this;

        if (Platform.OS === "android") {
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: "BuiltSpace App Permission",
                            message: "Builtspace needs access to your camera ",
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    } else {
                        alert("CAMERA permission denied");
                    }
                } catch (err) {
                    alert("Camera permission err", err);
                    console.warn(err);
                }
            }
            requestCameraPermission();
        }
    };

    onQRCodeScanDone = (qrCodeResult) => {
        var index = qrCodeResult.lastIndexOf("/");
        var qrcodeurl = qrCodeResult.substring(index + 1);

        var qrcodes = this.props.navigation.state.params.qrcodes;

        if (qrcodes == undefined) {
            console.log("qrcodes undefined");
            this.alertQRcode(qrcodeurl);
        } else {
            var findQR = loadQRMapping(qrcodes, qrCodeResult);
        }

        if (!findQR) {
            this.alertQRcode(qrcodeurl);
        } else {
            this.filterQR(findQR, qrcodeurl);
        }
    };

    filterQR = (qrMap, qrcodeurl) => {
        var checklists = this.props.navigation.state.params.checklists;
        if (qrMap.assetid == null) {
            // filter space based on qrcode spaceid
            var findSpace = this.props.navigation.state.params.spaces.find(
                (space) => space.id == qrMap.spaceid
            );

            // filter assets based on space floor
            var filteredAssets = this.props.navigation.state.params.assets.filter(
                (item) => item.spaces == findSpace.floor
            );

            // filter checklist based on the assets available
            var filteredChecklist = [];

            for (
                var checklist_index = 0;
                checklist_index < checklists.length;
                checklist_index++
            ) {
                if (checklists[checklist_index].assetCategory == "") {
                    filteredChecklist.push(checklists[checklist_index]);
                }
                for (
                    var asset_index = 0;
                    asset_index < filteredAssets.length;
                    asset_index++
                ) {
                    if (
                        filteredAssets[asset_index].categoryabbr ==
                        checklists[checklist_index].assetCategory
                    ) {
                        filteredChecklist.push(checklists[checklist_index]);
                    }
                }
            }
            this.alertQRcode(
                qrcodeurl,
                "space",
                findSpace.floor,
                qrMap.spaceid,
                filteredAssets,
                filteredChecklist
            );
        } else {
            // filter assets based on qrcode assetid
            var asset = this.props.navigation.state.params.assets.find(
                (asset) => asset.id == qrMap.assetid
            );
            if (asset == undefined) {
            } else {
                // filter checklist based on asset category
                var filteredChecklist = checklists.filter(
                    (item) =>
                        item.assetCategory == asset.categoryabbr ||
                        item.assetCategory === ""
                );
                if (filteredChecklist.length > 0) {
                    var findAsset = this.props.navigation.state.params.assets.find(
                        (asset) => asset.id == qrMap.assetid
                    );

                    this.alertQRcode(
                        qrcodeurl,
                        "asset",
                        findAsset.name,
                        qrMap.assetid,
                        null,
                        filteredChecklist
                    );
                }
            }

            // check if there are any checklists filtered
        }
    };

    alertQRcode = (
        qrcodeurl,
        type,
        type_name,
        typeid,
        filteredAssets = null,
        filteredChecklist
    ) => {
        this.setState({
            scan: false,
        });
        if (type_name == undefined) {
            this.props.navigation.goBack();
            this.props.navigation.state.params.loadQRCode(true, qrcodeurl);
        } else {
            this.props.navigation.goBack();
            this.props.navigation.state.params.loadQRCode(
                false,
                qrcodeurl,
                type,
                type_name,
                typeid,
                filteredAssets,
                filteredChecklist
            );
            showMessage({
                message: "QR Code is mapped to " + type + ": " + type_name,
                type: "info",
                color: "black",
                duration: 2500,
                floating: true,
            });
        }
    };

    render() {
        const scanner = () => {
            return (
                <View style={{ flex: 1 }}>
                    <CameraKitCameraScreen
                        showFrame={true}
                        scanBarcode={true}
                        laserColor={"#FF3D00"}
                        frameColor={"#00C853"}
                        colorForScannerFrame={"black"}
                        onReadCode={(event) => {
                            this.onQRCodeScanDone(
                                event.nativeEvent.codeStringValue
                            );
                        }}
                    />
                </View>
            );
        };
        return <View>{this.state.scan ? scanner() : <></>}</View>;
    }
}

export default QRCodeComponent;
