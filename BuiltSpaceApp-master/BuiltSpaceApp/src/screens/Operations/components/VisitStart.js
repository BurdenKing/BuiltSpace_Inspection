import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class StartVisit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jobNumberInput: '',
            assetGroupSelection: '',
            workCategorySelection: '',
            assetGroup: [],
            assetDropDown: [],
            buildingId: this.props.navigation.state.params.orgData,
            orgData: this.props.navigation.state.params.orgData,
            buildingData: this.props.navigation.state.params.buildingData,
        }
        this.getJobNumber = this.getJobNumber.bind(this)
        this.updateAssetGroupSelection = this.updateAssetGroupSelection.bind(this)
        this.updateWorkCategorySelection = this.updateWorkCategorySelection.bind(this)
    }

    componentWillMount = () => {
        this.formatAssetGroup();

    }

    formatAssetGroup = () => {
        const assetGroup = Array.from(this.props.navigation.state.params.orgData.assetGroup);
        let assetDropDown = []
        for (const item of assetGroup) {
            let assetItem = { value: item.name }
            assetDropDown.push(assetItem)
        }
        this.setState({
            assetGroup: assetGroup,
            assetDropDown: assetDropDown,
        })
    }

    viewSchedule = () => {
        console.log("Not Implemented");
    }

    getJobNumber = () => {
        console.log("Not Implemented");
    }

    updateAssetGroupSelection = (value) => {
        this.setState({
            assetGroupSelection: value,
        })
    }


    updateWorkCategorySelection = (value) => {
        this.setState({
            workCategorySelection: value,
        })
    }

    visitOkPress = () => {
        var myAssetGroup = Array.from(this.state.assetGroup)
        // console.log(JSON.stringify(this.state))
        myAssetGroup.forEach((item) => {
            if (item.name === this.state.assetGroupSelection) {
                myAssetGroup = { "assetGroup": { "0": item } }
            }
        })
        this.setState({
        })
        // console.log(Array.from(this.state.orgData.assetGroup))
        var temp = Array.from(this.state.orgData);
        temp[1] = myAssetGroup
        console.log(this.state.orgData);
        console.log(this.state.buildingData);
        this.props.navigation.navigate('ExploreBuilding', {
            assetGroup:"Heat Recovery Ventilator",
            buildingId: this.state.buildingId,
            orgData: this.state.orgData,
            buildingData: this.state.buildingData,

        })
    }


    render() {
        const orgData = this.props.navigation.state.params.orgData;
        const buildingData = this.props.navigation.state.params.buildingData;

        // console.log(buildingData);
        let jobNumberButton;
        (this.state.jobNumberInput == '') ? (
            jobNumberButton = <Button
                type='solid'
                title='Get Job Number'
                buttonStyle={{
                    backgroundColor: "#47d66d",
                }}
                titleStyle={{ color: "white" }}
                onPress={() => { this.getJobNumber() }}
            />
        ) : (
                jobNumberButton = <Button
                    type='solid'
                    title='Get Job Number'
                    disabled='true'
                                                                    buttonStyle={{
                                                    backgroundColor: "#47d66d",
                                                }}
                                                titleStyle={{ color: "white" }}
                    onPress={() => { this.getJobNumber() }}
                />
            )
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => { this.viewSchedule() }}>
                    <Text style = {styles.headertext}> Tap to view Scheduled Work</Text>
                </TouchableOpacity>
                <View>
                    <Dropdown
                        label="Asset Groups"
                        data={this.state.assetDropDown}
                        onChangeText={(value) => this.updateAssetGroupSelection(value)}
                        fontSize = {16}
                        labelFontSize = {15}
                        baseColor = {'#008000'}
                        selectedItemColor = {'#43BC4F'}
                        itemTextStyle ={styles.itemText}
                    >
                    </Dropdown>
                </View>
                <View>
                    <View>
                        <TextInput
                            placeholder='Enter Job Number...'
                            onChangeText={(value) => this.setState({
                                jobNumberInput: value,
                            })}
                        />
                        {jobNumberButton}
                    </View>
                </View>
                <View>
                    <Dropdown
                        label="Select a Work Category"
                        data={[{ value: 'PM - Major' }, { value: 'PM - Minor' }, { value: 'Service' }]}
                        onChangeText={(value) => this.updateWorkCategorySelection(value)}
                        fontSize = {16}
                        labelFontSize = {15}
                        baseColor = {'#008000'}
                        selectedItemColor = {'#43BC4F'}
                        itemTextStyle ={styles.itemText}
                    >
                    </Dropdown>
                </View>
                <View>
                    <Button
                        type='solid'
                        title='OK'
                        buttonStyle={{
                            backgroundColor: "#47d66d",
                        }}
                        titleStyle={{ color: "white" }}
                        onPress={() => { this.visitOkPress() }}
                    />
                    <Button
                        type='outline'
                        title='Cancel'
                        
                        onPress={() => this.props.navigation.navigate('BuildingDetails')}
                    />
                </View>
            </View>
        )
    }

};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 5,
    },
    headertext:{
        fontFamily:'Roboto',
        fontSize: 15,
        color:'#43BC4F',
    },
    itemText:{
        fontFamily: 'Roboto',
        textAlign: 'center',
    }
});
