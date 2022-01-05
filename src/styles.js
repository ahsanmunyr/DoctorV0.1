import {Dimensions, StyleSheet} from 'react-native'

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}

export default StyleSheet.create({
    max: {
        width:dimensions.width,
        flex:1
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height,
    },
    remoteContainer: {
        width: '100%',
        flex:1,
    },
    remote: {
        width: dimensions.width,
        flex:1
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
})