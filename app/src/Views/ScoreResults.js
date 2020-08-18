// Views/ScoreResults.js

import React from 'react'
import {ActivityIndicator, Button, Image, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux';
import {updateInformationUserFirebase} from "../../Services/UploadService";
import auth from "@react-native-firebase/auth";
import {convertDateFormatToSeconds, renderLoading} from "../../Utils/Utils";
import firestore from "@react-native-firebase/firestore";
import {config} from "../../Utils/config";


class ScoreResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scorePoints: undefined,
            receivedData: false,
            startMissionImageBoxURL: undefined,
            endMissionImageBoxURL: undefined,
            isLoading: true,
            data: undefined
        };

        console.log('[RESULTS] Start Mission Image URL: ', this.props.startMission.time);
        this.durationMissionInSeconds = convertDateFormatToSeconds(this.props.endMission.time) - convertDateFormatToSeconds(this.props.startMission.time);
        this.minutes = Math.floor(this.durationMissionInSeconds / 60);
        this.seconds = this.durationMissionInSeconds - this.minutes * 60;
    }

    _renderLoading(isLoading) {
        if (isLoading) {
            return (
                <View>
                    <ActivityIndicator size='large' />
                </View>
            );
        }
    }

    _clickButton() {
    }

    _computeScore() {
        let score;
        if (!this.state.data.is_same) {
            score = 0;
        } else {
            if (this.minutes === 0) {
                score = this.state.data.trash_count_diff;
            }
            else {
                score = this.state.data.trash_count_diff / this.minutes;
            }
        }
        this.setState({scorePoints: score});
        updateInformationUserFirebase(auth().currentUser.uid, {points: firestore.FieldValue.increment(score)})
            .then(() => {
                console.log('Success: Updated image in Firebase of the user: ', auth().currentUser.uid);
            })
            .catch((error) => console.log(error));
    }

    _displayResults() {
        if (this.state.receivedData) {
            if (!this.state.data.is_same) {
                return (
                    <View>
                        <Text style={styles.descriptionText}>
                            Humm our algorithm found that the two pictures does not corresponds to the same place.
                            Maybe you can try to take another picture from the same spot that the place where you began the mission ?
                        </Text>
                        <Button
                            title='Retake final picture'
                            onPress={() => this.props.navigation.navigate('EndMission')}
                            color='green'
                        />
                    </View>
                );
            } else {
                return (
                    <View>
                        <View style={{flexDirection: 'column', justifyContent: 'space-around' }}>
                            <View>
                                <Image style={styles.picture} source={{uri: this.state.startMissionImageBoxURL}}/>
                            </View>
                            <View>
                                <Image style={styles.picture} source={{uri: this.state.endMissionImageBoxURL}} />
                            </View>
                        </View>
                        <Text style={styles.pointsText}>You've collected {this.state.data.trash_count_diff} garbage
                            in {this.minutes} minutes and {this.seconds} seconds !
                        </Text>
                        <Text style={styles.pointsText}>You've received {this.state.scorePoints} points for those pictures ! Congratulations !</Text>
                        <Button
                            title='Done'
                            onPress={() => this.props.navigation.navigate('LeaderBoard')}
                            color='green'
                        />
                    </View>
                );
            }
        }

    }

    _sendImagesToAPIAndGetScore() {
        const body = new FormData;
        body.append("url_before", this.props.startMission.imageURL);
        body.append("url_after", this.props.endMission.imageURL);

        fetch(config.endpointAPI, {
            body,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            method: "POST"
        })
            .then(response => response.json())
            .then((data) => {
                console.log('[DATA]: ', data);
                this.setState({startMissionImageBoxURL: config.endpointDownloadImage + data.download_link_before,
                    endMissionImageBoxURL: config.endpointDownloadImage + data.download_link_after
                });
                this.setState({receivedData: true, isLoading: false, data: data});
                this._computeScore();
        });
    }


    componentDidMount() {
        setTimeout( () => {
            this._sendImagesToAPIAndGetScore();
        }, 1000);
    }


    render() {
        return (
            <View style={styles.main_container}>
                {!this.state.receivedData &&
                <Text style={styles.descriptionText}>
                    The mission is finished ! It took {this.minutes} minutes and {this.seconds} seconds !
                    Now it is time to count your score. Wait a little, we are comparing the
                    two pictures with our algorithm !
                </Text>}
                {this._renderLoading(this.state.isLoading)}
                {this._displayResults()}
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
    picture: {
        width: 280,
        height: 160,
        borderRadius: 10,
        borderColor: '#9B9B9B',
        borderWidth: 2,
        marginBottom: 10
    },
    descriptionText: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        width: 300,
    },
    pointsText: {
        textAlign: 'center',
        fontSize: 14,
        width: 300,
        marginBottom: 10,
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
    preloading_container: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },




})


const mapStateToProps = (state) => {
    return {
        startMission: state.startMissionReducer.startMission,
        endMission: state.endMissionReducer.endMission,
    }
}


export default connect(mapStateToProps)(ScoreResults);
