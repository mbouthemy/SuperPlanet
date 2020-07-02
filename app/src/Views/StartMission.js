// Views/StartMission.js

import React, {useState} from 'react';
import {StyleSheet, View, Text, Button, Switch, TouchableOpacity, Image} from 'react-native';

class StartMission extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _startMission() {
        console.log('Start the mission');
    }

    render() {

        return (
            <View style={styles.main_container}>
                <Text style={styles.descriptionText}>
                    You're just ready to start a new mission ! When you have found a new place to clean, press the button
                    to start the mission and take the picture of the place !
                </Text>
                <TouchableOpacity
                    style={styles.btnStartMission}
                    onPress={() => this._startMission()}>
                    <Image style={{width:60, height:60}} source={require('../../Assets/Images/ic_superhero.png')}/>
                    <Text style={styles.textIcon}>Start a new mission !</Text>
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
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
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
    // Icons Recording and stop
    btnStartMission: {
        backgroundColor:"#70a139",
        width:180,
        height:180,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 50
    },
    iconRecord: {
        width: 50,
        height: 50
    },

    btnNext: {
        width: 200,
    },

});



export default (StartMission);
