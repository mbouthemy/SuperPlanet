// Views/EndMission.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, TouchableOpacity, Image, ActivityIndicator
} from 'react-native'
import {
    createStorageReferenceToFile,
    getFileLocalPath,
    updateInformationUserFirebase
} from "../../Services/UploadService";
import ImagePicker from "react-native-image-picker";
import {getFormattedDate, imagePickerOptions, renderLoading} from "../../Utils/Utils";
import auth from "@react-native-firebase/auth";
import {connect} from "react-redux";


class EndMission extends React.Component {

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

    _uploadImageToFireBase = (imagePickerResponse, pathFirestore) => {
        const fileSource = getFileLocalPath(imagePickerResponse);
        const storageRef = createStorageReferenceToFile(pathFirestore);
        this.setState({storageRef: storageRef})
        return storageRef.putFile(fileSource);
    };

    _uploadImage(){
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            if (response.didCancel) {
                console.log('Post Canceled')
            }
            else if (response.error) {
                console.log('Error : ', response.error)
            }
            else {
                console.log('Photo URI: ', response.uri )
                let requireSource = { uri: response.uri }
                this.setState({imageURI: requireSource, isLoading: true})

                const pathFirestoreImageUser: string = 'users/' + auth().currentUser.uid + '/images/end_img_' + getFormattedDate(true);

                Promise.resolve(this._uploadImageToFireBase(response, pathFirestoreImageUser))
                    .then(() => {
                        console.log('The picture has been correctly uploaded.');
                        this.state.storageRef.getDownloadURL().then((downloadURL) => {
                            console.log('Download URL: ', downloadURL);
                            const currentTime = getFormattedDate();

                            const action = { type: "ADD_END_MISSION", value: {imageURL: downloadURL, time: currentTime}};
                            this.props.dispatch(action);

                            this.setState({imageURL: downloadURL, isLoading: false, isImageUploaded: true});
                            this.props.navigation.navigate('ScoreResults');
                            updateInformationUserFirebase(auth().currentUser.uid, {image_end_mission: this.state.imageURL, time_end_mission: getFormattedDate()})
                                .then(() => {
                                    console.log('Success: Added the end image in Firebase of the user: ', auth().currentUser.uid);
                                })
                                .catch((error) => console.log(error));
                        });
                    })
                    .catch(error => {console.log('Error: ', error)});
            }
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            );
        }
        return (
            <View style={styles.main_container}>
                <Text style={styles.descriptionText}>
                    When you're done, just click on the button to take a picture of the same place where you have cleaned
                    and get some rewards points !
                </Text>
                <TouchableOpacity
                    style={styles.btnEndMission}
                    onPress={() => this._uploadImage()}>
                    <Image style={{width:60, height:60}} source={require('../../Assets/Images/ic_like.png')}/>
                    <Text style={styles.textIcon}>Finish the mission !</Text>
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

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F3F3'
    },


});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapDispatchToProps)(EndMission);
