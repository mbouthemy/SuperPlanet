// Views/Login.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, TextInput, ActivityIndicator, Alert, Image
} from 'react-native';
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

    _openTermsConditions(){
        this.props.navigation.navigate('ViewPDF', {sourcePDF: 'bundle-assets://pdf/TermsAndConditions.pdf'});
    }

    _openPrivacyPolicy() {
        this.props.navigation.navigate('ViewPDF', {sourcePDF: 'bundle-assets://pdf/PrivacyPolicy.pdf'});
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
                <Image source={require('../../Assets/AppIcons/logo_app.png')} style={styles.appLogo}/>
                <Text style={styles.textIntroduction}>Congratulations for your application and welcome in the Gaia's League ! {"\n"} {"\n"}
                    Your mission, should you choose to accept it, is to help clean up this planet before it becomes a gigantic dump. {"\n"} {"\n"}
                    But first, what is your superhero's name ?
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput style={[styles.inputs]}
                               multiline={false}
                               placeholder='Write your superhero name'
                               underlineColorAndroid='transparent'
                               ref={input => { this.textInput = input }}
                               onChangeText={(text) => this._messageTextInputChanged(text)}
                               onSubmitEditing={this._handleSubmit}
                    />
                </View>
                <Button
                    title='Sign In'
                    onPress={this._handleSubmit}
                    color='green'
                    disabled={!this.state.isPossibleToLog}
                />

                {/*Terms & Conditions footer.
                <Text style={styles.termsConditionText}>
                    By clicking on log in, you agree with our
                    <Text style={styles.linkTermsText}
                          onPress={() => this._openTermsConditions()}> Terms & conditions</Text> and the
                    <Text style={styles.linkTermsText}
                          onPress={() => this._openPrivacyPolicy()}> Privacy Policy.</Text>
                </Text>*/}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    appLogo: {
        marginBottom: 20,
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    textIntroduction: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        width: 300,
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
    inputContainer: {
        borderBottomColor: '#707578',
        borderRadius:30,
        borderBottomWidth: 1,
        height:30,
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 50,
    },
    inputs:{
        height:40,
        borderBottomColor: '#FFFFFF',
    },
    termsConditionText: {
        marginTop: 25,
        textAlign: 'center',
    },
    linkTermsText: {
        color: '#243db6',
    },
});


export default (Login);
