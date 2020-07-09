import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',
    },
    buildingTopcontainer:{
        marginLeft:10,
        marginRight:10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 16,
        marginBottom: 3,
        marginLeft: 15,
        marginTop: 15,
        marginRight: 15,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    text: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
    },
    inspectionButtonContainer: {
        flexDirection: 'row',
        marginLeft: 15
    },
    submit:{
        width: 100,
        height: 45,
        padding: 10,
        margin: 5,
        backgroundColor: '#43BC4F',
    },
    delete:{
        width: 100,
        height: 45,
        padding: 10,
        margin: 5,
        backgroundColor: 'red',
    },
    selectText:{
        margin: 2,
    },
    detailsTextContainer: {
        padding: 15,
        marginTop:20,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#000',
        borderRadius: 2,
        borderWidth: 2,
    },
    detailsTextBold: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
    },
    detailsText: {
        color: 'black',
        fontWeight: 'normal',
        fontSize: 16,
    },
    flatList: {
        backgroundColor: 'white',
    },
    TextContainer: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'red',
        borderRightWidth: 50
    },
    TextContainerSelected: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'green',
        borderRightWidth: 50
    },
    headingTextBold: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start'
    },
    questionsHeader: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 5
        
    },
    addQuestionButton: {
        padding: 10, 
        margin: 10, 
        backgroundColor: '#43BC4F',
    },
    listIcon: {
        justifyContent: 'flex-end',
        textAlign: "right"
    },
    select_container: {
        flex: 1,
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'white',
    },
    select_row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 16,
        marginBottom: 3,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    loadingIndicator: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    FlatListFooter: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        margin: 2,
        backgroundColor: '#47d66d',
        
    },
    refreshBtn:{
        backgroundColor:'#43BC4F',
        width: 36,
        height: 36,
        borderRadius: 36/2,
        alignItems:'center',
        justifyContent:'center',
    }
});