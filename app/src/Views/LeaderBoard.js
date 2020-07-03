// Views/LeaderBoard.js

import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text, Button, Switch, FlatList, ActivityIndicator, TouchableOpacity
} from 'react-native'
import firestore from "@react-native-firebase/firestore";
import AvatarItem from "./AvatarItem";


class LeaderBoard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            counterPerson: 0,
            persons: [],
            isLoading: true,
            currentUser: undefined,
            playState:'paused',
            isModalVisible: false,
            positionUser: 'unknown'
        }
    }

    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _getPeopleFromFirebase() {
        console.log('Querying People from Firebase')
        const ref =  firestore().collection('people')
            .onSnapshot(querySnapshot => {
                let listUsers = [];
                querySnapshot.forEach(doc => {
                    listUsers.push({
                        ...doc.data()
                    });
                });

                this.setState(
                    {
                        persons: listUsers.sort((a, b) => -(a.points - b.points)),
                        isLoading: false
                });
                console.log(listUsers);

                console.log('[LEADERBOARD] Received the users.')
            })
    }


    componentDidMount() {
        this._getPeopleFromFirebase();
    }

    render() {
        return (
            <View style={styles.main_container}>
                <FlatList
                    data={this.state.persons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) =>
                        <AvatarItem user={item}/>}
                    ItemSeparatorComponent={this._renderSeparator}
                />
                {this._displayLoading()}
            </View>
        );
    }
}



const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    image: {
        width: 60,
        height: 60,
        margin: 5,
        borderRadius: 30,
    },
    content_container: {
        flex: 1,
        margin: 5
    },
    header_container: {
        flex: 3,
        flexDirection: 'row'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
    },
    level_text: {
        fontSize: 20,
    },
    nb_messages_text: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#666666'
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

})


export default (LeaderBoard);
