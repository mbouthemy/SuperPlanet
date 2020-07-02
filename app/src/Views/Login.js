// Views/Login.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch
} from 'react-native'


class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Text>Login Screen.</Text>
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


export default (Login);
