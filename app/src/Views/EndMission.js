// Views/EndMission.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, TouchableOpacity, Image
} from 'react-native'


class EndMission extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _endMission() {
        console.log('End the mission');
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Text style={styles.descriptionText}>
                    When you're done, just click on the button to take a picture of the place that you've cleaned
                    and get some rewards points !
                </Text>
                <TouchableOpacity
                    style={styles.btnEndMission}
                    onPress={() => this._endMission()}>
                    <Image style={{width:60, height:60}} source={require('../../Assets/Images/ic_like.png')}/>
                    <Text style={styles.textIcon}>End the mission !</Text>
                </TouchableOpacity>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent:'center', // Y Axis
        alignItems: 'center',
    },
    descriptionText: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        width: 300,
    },
    textIcon: {
        fontSize: 16,
    },
    btnEndMission: {
        backgroundColor:"#70a139",
        width:160,
        height:160,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 50
    },
    iconRecord: {
        width: 50,
        height: 50
    },


})


export default (EndMission);
