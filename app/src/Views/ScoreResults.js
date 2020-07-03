// Views/ScoreResults.js

import React from 'react'
import {Button, Image, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux';
import {updateInformationUserFirebase} from "../../Services/UploadService";
import auth from "@react-native-firebase/auth";
import {convertDateFormatToSeconds} from "../../Utils/Utils";
import firestore from "@react-native-firebase/firestore";


class ScoreResults extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            scorePoints: undefined,
        }

        console.log('[RESULTS] Props: ', this.props);
        console.log('[RESULTS] Start Mission Image URL: ', this.props.startMission.time);
        this.durationMissionInSeconds = convertDateFormatToSeconds(this.props.endMission.time) - convertDateFormatToSeconds(this.props.startMission.time)
        this.minutes = Math.floor(this.durationMissionInSeconds / 60);
        this.seconds = this.durationMissionInSeconds - this.minutes * 60;
    }


    _clickButton() {
    }

    _sendImagesToAPIAndGetScore() {
        console.log('[RESULTS] SENDING THE TWO IMAGES, WAITING 5 SECONDS');
        this.setState({scorePoints: 5});
        updateInformationUserFirebase(auth().currentUser.uid, {points: firestore.FieldValue.increment(this.state.scorePoints)})
            .then(() => {
                console.log('Success: Updated image in Firebase of the user: ', auth().currentUser.uid);
            })
            .catch((error) => console.log(error));
    }


    componentDidMount() {
        setTimeout( () => {
            this._sendImagesToAPIAndGetScore();
        }, 1000);
    }


    render() {
        return (
            <View style={styles.main_container}>
                <View style={{flexDirection: 'column', justifyContent: 'space-around' }}>
                    <View>
                        <Image style={styles.picture} source={{uri: this.props.startMission.imageURL}}/>
                    </View>
                    <View>
                        <Image style={styles.picture} source={{uri: this.props.endMission.imageURL}} />
                    </View>
                </View>
                <Text style={styles.descriptionText}>
                    The mission is finished ! It took {this.minutes} minutes and {this.seconds} seconds !
                    Now it is time to count your score. Wait a little, we are comparing the
                    two pictures with our algorithm !
                </Text>
                {this.state.scorePoints &&
                    <Text style={styles.pointsText}>You've received {this.state.scorePoints} points for those pictures ! Congratulations !</Text>
                }
                <Button
                    title='Done'
                    onPress={() => this.props.navigation.navigate('LeaderBoard')}
                    color='green'
                />
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


})


const mapStateToProps = (state) => {
    return {
        startMission: state.startMissionReducer.startMission,
        endMission: state.endMissionReducer.endMission,
    }
}


export default connect(mapStateToProps)(ScoreResults);
