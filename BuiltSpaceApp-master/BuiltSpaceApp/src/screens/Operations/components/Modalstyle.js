import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    textContainer: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'red',
        borderRightWidth: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    textContainerSelected: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: '#43BC4F',
        borderRightWidth: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    optionText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30
    },
    titleTop: {
        backgroundColor: '#43BC4F',
        width: '100%',
        height: 65,
    },
    headingTextBold: {
        color: 'white',
        marginTop:10,
        fontSize: 30,
        alignSelf: 'center',
    
    },
    detailsText: {
        color: 'red',
        fontWeight: 'normal',
        fontSize: 16,
        alignSelf: 'center'
    },
    detailsTextSelected: {
        color: '#43BC4F',
        fontWeight: 'normal',
        fontSize: 16,
        alignSelf: 'center'
    },
    row: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: 16,
		marginBottom: 3,
		marginLeft: 15,
		marginTop: 170,
		marginRight: 15,
		borderBottomColor: 'white',
		borderBottomWidth: 2,
	},
    text: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
    },
    flatList: {
        backgroundColor: '#FAF9ED',
    },
    assetListItems: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#43BC4F',
    },
    listContainer: {
        flex: 1,
    },
    bottomContainer: {
        width: '100%',
        height: 100,
        backgroundColor: '#43BC4F',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        borderTopColor: "black",
        borderTopWidth: 1.1
    },
    listText: {
        justifyContent: 'flex-start',
        fontSize: 15,
        paddingLeft: 5
    },
    numAssets: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    closeButton: {
        textAlign: "center",
        color: 'white',
        fontSize: 23.5,
        fontWeight: "900",
        marginTop: 3
    },
    listIcon: {
        paddingRight: 15,
        paddingLeft: 10
    },
    addIcon: {
        alignSelf: 'center',
    },
    listIconContainer: {
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    checklistItems: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#43BC4F',
    },
    modalEnable: {
    },
    modalDisable: {
        backgroundColor: 'lightgrey'
    }
});
