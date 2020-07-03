// Views/Login.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, TextInput, ActivityIndicator, Alert
} from 'react-native'
import auth from '@react-native-firebase/auth';
import {addInformationUserFirebase} from "../../Services/UploadService";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.userName = '';
        this.state = {
            isLoading: false,
            isPossibleToLog: false,
        };
    }

    componentDidMount() {
        this.__isTheUserAuthenticated();
    }

    _messageTextInputChanged(text) {
        this.userName = text;
        this.setState({isPossibleToLog: true});
    }

    __isTheUserAuthenticated = () => {
        if (auth().currentUser) {
            console.log('User is Logged', auth().currentUser.uid);
            this.props.navigation.navigate('MainTab');
        } else {
            console.log('User is not Logged');
        }
    };

    _handleSubmit = () => {
        this.setState({isLoading: true});
        auth().signInAnonymously()
            .then((res) => {
                addInformationUserFirebase(res.user.uid,
                    {id: res.user.uid, name: this.userName, points: 0})
                    .then(() => {
                        console.log('Success: Added Presentation on the user: ', res.user.uid);
                    })
                    .catch((error) => console.log(error));

                this.setState({isLoading: false});
                console.log('User logged-in successfully!');
                this.props.navigation.navigate('MainTab');
            })
            .catch(error => {
                Alert.alert('Incorrect credentials',
                    'The login information are incorrect. You can reset your password if you forgot it.');
            })
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Text>Welcome to the SuperPlanet application !</Text>
                <Text>Please tell us your superhero name:</Text>
                <TextInput style={[styles.inputs]}
                           multiline={true}
                           placeholder='Write your superhero name'
                           underlineColorAndroid='transparent'
                           ref={input => { this.textInput = input }}
                           onChangeText={(text) => this._messageTextInputChanged(text)}
                           onSubmitEditing={() => this._handleSubmit}
                />
                <Button
                    title='Next'
                    onPress={this._handleSubmit}
                    color='green'
                    disabled={!this.state.isPossibleToLog}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    inputs:{
        height:40,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    // Google Sign in
    signInButton: {
        width: 192,
        height: 48
    },
    userInfoContainer: {
        marginVertical: 20
    },
    profileImageContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profileImage: {
        width: 100,
        height: 100
    },
    displayTitle: {
        fontSize: 22,
        color: '#010101'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    forgottenPasswordText: {
        color: '#b41233',
        marginTop: 25,
        textAlign: 'center'
    },
    termsConditionText: {
        marginTop: 25,
        textAlign: 'center'
    },
});


export default (Login);
