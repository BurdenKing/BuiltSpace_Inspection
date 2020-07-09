import { StyleSheet } from 'react-native';

export default StyleSheet.create ({
    container: {
        // flex: 2,
        marginTop: 20,
        marginLeft:15,
        marginRight:15
    },
    selectText:{
        margin:2,
    },
    homePageText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    button_view: {
        // flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 15,
    },
    button_container: {
        width: 240,
        alignSelf: 'center',
        margin: 10,
    },
    buttons: {
        backgroundColor: '#43BC4F',
        margin: 5,
        height: 50,
    },
    button_text: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginTop: 13,
    },
    inspectionContainer: {
        alignSelf: 'center',
        width: '100%',
        margin: 5,
    },
    inspectTitle:{
        marginTop: 10,
        marginBottom: 20,
        fontSize:18,
        fontWeight: 'bold',
    },
    inspectionRow: {
        flex: 2,
        flexDirection: 'row',
    },
    checkbox: {
        flex: 1
    },
    inspectionButtonContainer: {
        flexDirection: 'row',
        marginLeft: 15
    },
    inspectionName: {
        flex: 1,
        fontSize: 15
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
    submitText:{
        color:'white',
        fontSize:17,
        textAlign:'center',
        fontWeight: 'bold',
    },
    refreshBtn:{
        backgroundColor:'#43BC4F',
        width: 36,
        height: 36,
        borderRadius: 36/2,
        alignItems:'center',
        justifyContent:'center',
    },
    refreshBtnGreyed:{
        backgroundColor:'grey',
        width: 36,
        height: 36,
        borderRadius: 36/2,
        alignItems:'center',
        justifyContent:'center',
    }
});