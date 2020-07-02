// Views/EndMission.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch
} from 'react-native'


class EndMission extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Text>Start the mission.</Text>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

})


export default (EndMission);
