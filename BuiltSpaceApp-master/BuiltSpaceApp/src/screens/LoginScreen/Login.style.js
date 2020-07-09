import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 235,
        height: 250
    },
    form_container: {
        padding: 20
    },
    input: {
        height: 50,
        // backgroundColor: 'rgba(255,255,255,0.2)',
        backgroundColor: '#ABA9A9',
        marginBottom: 10,
        color: 'white',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#43BC4F',
        paddingVertical: 10,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 20,
    }
});