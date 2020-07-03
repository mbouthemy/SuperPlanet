// Views/ScoreResults.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, TouchableOpacity, Image
} from 'react-native'


class ScoreResults extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _clickButton() {
    }


    render() {
        return (
            <View style={styles.main_container}>
                <View style={{flexDirection: 'column', justifyContent: 'space-around' }}>
                    <View>
                        <Image style={styles.picture} source={require('../../Assets/Images/logo_batman.png')}/>
                    </View>
                    <View>
                        <Image style={styles.picture} source={require('../../Assets/Images/logo_batman.png')} />
                    </View>
                </View>
                <Text style={styles.descriptionText}>
                    The mission is finished ! Now it is time to count your score. Wait a little, we are comparing the
                    two pictures with our algorithm !
                </Text>
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


export default (ScoreResults);
