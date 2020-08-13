// Views/StartMission.js

import React, {useState} from 'react';
import {StyleSheet, View, Text, Button, Switch, TouchableOpacity, Image} from 'react-native';
import auth from "@react-native-firebase/auth";

import ImagePicker from 'react-native-image-picker';
import { imagePickerOptions } from '../../Utils/Utils';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import {getFormattedDate} from "../../Utils/Utils";
import {
    createStorageReferenceToFile,
    getFileLocalPath,
    updateInformationUserFirebase
} from "../../Services/UploadService";
import {renderLoading} from '../../Utils/Utils';
import { connect } from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from "react-native-vector-icons/Ionicons";

class StartMission extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            imageURI: '',
            storageRef: undefined,
            imageURL: '',
            isLoading: false,
            isImageUploaded: false,
        }
    }

    _signOutUser = async () => {
        console.log('[AUTH] Sign Out the User.')
        try {
            await auth().signOut();
            this.props.navigation.navigate('Login');
        } catch (e) {
            console.log(e);
        }
    }

    _uploadImageToFireBase = (imagePickerResponse, pathFirestore) => {
        const fileSource = getFileLocalPath(imagePickerResponse);
        const storageRef = createStorageReferenceToFile(pathFirestore);
        this.setState({storageRef: storageRef})
        return storageRef.putFile(fileSource);
    };

    _uploadImage(){
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            if (response.didCancel) {
                console.log('Post Canceled');
            }
            else if (response.error) {
                console.log('Error : ', response.error);
            }
            else {
                console.log('Photo URI: ', response.uri );
                let requireSource = { uri: response.uri };
                this.setState({imageURI: requireSource, isLoading: true});

                const pathFirestoreImageUser: string = 'users/' + auth().currentUser.uid + '/images/start_img_' + getFormattedDate(true);

                Promise.resolve(this._uploadImageToFireBase(response, pathFirestoreImageUser))
                    .then(() => {
                        console.log('The picture has been correctly uploaded.');
                        this.state.storageRef.getDownloadURL().then((downloadURL) => {
                            console.log('Download URL: ', downloadURL)
                            const currentTime = getFormattedDate();

                            const action = { type: "ADD_START_MISSION", value: {imageURL: downloadURL, time: currentTime}};
                            this.props.dispatch(action);

                            this.setState({imageURL: downloadURL, isLoading: false, isImageUploaded: true});
                            this.props.navigation.navigate('EndMission');
                            updateInformationUserFirebase(auth().currentUser.uid, {image_start_mission: this.state.imageURL, time_start_mission: currentTime})
                                .then(() => {
                                    console.log('Success: Added image in Firebase of the user: ', auth().currentUser.uid);
                                })
                                .catch((error) => console.log(error));
                        });
                    })
                    .catch(error => {console.log('Error: ', error)});
            }
        });
    }


    render() {

        return (
            <View style={styles.main_container}>
{/*                <Button
                    title='Sign out (only in debug)'
                    onPress={() => this._signOutUser()}
                />*/}
                <Text style={styles.descriptionText}>
                    You're just ready to start a new mission ! When you have found a new place to clean, press the button
                    to start the mission and take the picture of the place !
                </Text>
                <TouchableOpacity
                    style={styles.btnStartMission}
                    onPress={() => this._uploadImage()}>
                    <Image style={{width:60, height:60}} source={require('../../Assets/Images/ic_superhero.png')}/>
                    <Text style={styles.textIcon}>Start a new mission !</Text>
                </TouchableOpacity>
                <Image style={styles.imagePark} source={require('../../Assets/Images/park_with_garbage.jpg')}/>
                {renderLoading(this.state.isLoading)}
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
    imagePark: {
        width:160,
        height:160,
        borderRadius: 180,
    },
    textIcon: {
        color: '#2fb126',
        fontSize: 16,
    },
    //
    btnStartMission: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 6, // Android
        width:180,
        height:180,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 10
    },
    iconRecord: {
        width: 50,
        height: 50
    },
});



const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapDispatchToProps)(StartMission);
