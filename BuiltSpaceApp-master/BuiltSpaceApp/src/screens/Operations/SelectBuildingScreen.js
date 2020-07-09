import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { ContextInfo } from "../../ContextInfoProvider";
import { get_org_data } from "../../storage/fetchAPI.js";
import {
    insertOrgData,
    DBcheckOrgData,
    updateOrgs,
} from "../../storage/schema/dbSchema";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./BuildingScreen.style.js";

export class SelectBuildingScreen extends Component {
    static contextType = ContextInfo;
    constructor(props) {
        super(props);
        this.state = {
            org_data: [],
            isLoading: true,
        };
    }

    componentDidMount = () => {
        this.loadOrgs();
    };

    loadOrgs = () => {
        /**
         * loads the orginaztion data
         */
        var currentDate = new Date(); // current datetime as object

        //API call to get org_data and update the database
        DBcheckOrgData(
            this.context.accountContext.account,
            this.props.navigation.state.params.orgName
        )
            .then((result) => {
                // Error throws because it cannot find the object in DB due to deletion/updated in orgsupdate?
                if (!result) {
                    console.log("no data in org, fetching data...");
                    get_org_data(
                        this.props.navigation.state.params.orgName,
                        this.context.accountContext.account.api_key
                    ).then((result) => {
                        console.log("no data in db, get_org_data");
                        insertOrgData(
                            this.context.accountContext.account,
                            result,
                            currentDate
                        );
                        this.setState({
                            orglastUpdated: currentDate.toLocaleString(),
                            org_data: result,
                            isLoading: false,
                        });
                    });
                } else {
                    if (
                        result[0].lastUpdated !== undefined &&
                        result[0].lastUpdated !== null
                    ) {
                        //get datetime of last updated organizations
                        //and add 1 hour to last updated time
                        var addHour = result[0].lastUpdated;
                        addHour.setHours(addHour.getHours() + 1);

                        if (this.context.networkContext.isConnected) {
                            if (currentDate < addHour) {
                                console.log(
                                    "SelectBuildingScreeN: Fetch from database" +
                                        result[0].name
                                );
                                this.setState({
                                    orglastUpdated: result[0].lastUpdated.toLocaleString(),
                                    org_data: result[0],
                                    isLoading: false,
                                });
                            }


                            if (
                                currentDate >= addHour &&
                                this.context.networkContext.isConnected
                            ) {
                                this.updateOrganizations();
                            }
                        } else {
                            console.log(
                                "No network, SelectBuildingScreeN: Fetch from database" +
                                    result[0].name
                            );
                            this.setState({
                                orglastUpdated: result[0].lastUpdated.toLocaleString(),
                                org_data: result[0],
                                isLoading: false,
                            });
                        }
                    } else {
                        this.updateOrganizations();
                    }
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    updateOrganizations = () => {
        /*
        on component did mount, this function will check if their
        is organization data in realm db.
        if none, it will run the updateOrgs function in dbSchema.js
        if it exists, the function will check the datetime if 1 hour has passed.
        if the time exeeds 1 hour from the last update, it will run
        the updateOrgs function.
      */
        var currentDate = new Date(); // current datetime as objects
        get_org_data(
            this.props.navigation.state.params.orgName,
            this.context.accountContext.account.api_key
        ).then((result) => {
            console.log(
                "selectBuildingScreen fetch api and update",
                result.name
            );
            updateOrgs(
                this.context.accountContext.account,
                result,
                currentDate
            );
            this.setState({
                orglastUpdated: currentDate.toLocaleString(),
                org_data: result,
                isLoading: false,
            });
        });
    };

    render() {
        return this.state.isLoading ? (
            <View>
                <Text>Loading</Text>
            </View>
        ) : (
            <View style={styles.select_container}>
                <Text style={styles.selectText}>
                    Connection status:{" "}
                    {this.context.networkContext.isConnected
                        ? "online"
                        : "offline"}
                </Text>
                <Text style={styles.selectText}>
                    Logged in as: {this.context.accountContext.account.email}
                </Text>
                <Text style={styles.selectText}>
                    Organization last updated on: {this.state.orglastUpdated}
                </Text>

                <View style={{ flexDirection: "row" }}>
                    <View style={this.context.networkContext.isConnected ? styles.refreshBtn : styles.refreshBtnGreyed}>
                        <Icon
                            onPress={() => {
                                this.setState({ isLoading: true });
                                this.updateOrganizations();
                            }}
                            name="refresh"
                            size={26}
                            color="white"
                        />
                    </View>
                    <Text> Reload Data</Text>
                </View>
                <FlatList
                    data={this.state.org_data.buildings}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate(
                                    "BuildingDetails",
                                    {
                                        buildingAddress: item.address,
                                        buildingCity: item.city,
                                        buildingName: item.name,
                                        buildingProvince: item.provincestate,
                                        buildingPostalCode: item.postalcode,
                                        buildingId: item.id,
                                        orgData: this.state.org_data,
                                        buildingData: item,
                                    }
                                )
                            }
                        >
                            <View style={styles.select_row}>
                                <Text style={styles.text}>{item.name}</Text>
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
                    )}
                    keyExtractor={(item) => item.name}
                />
            </View>
        );
    }
}

export default SelectBuildingScreen;
