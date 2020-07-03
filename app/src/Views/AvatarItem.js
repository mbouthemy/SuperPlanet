// Components/ChatItem.js

import React from 'react'
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native'

class AvatarItem extends React.Component {

    constructor(props) {
        super(props);
        this.randomAvatarList = ['../../Assets/Images/logo_batman.png', "../../Assets/Images/logo_superman.png", "../../Assets/Images/logo_.png"];
        this.state = {
            isLoading: true,
        }
    }


    /**
     * Ensure that the current user is not displayed but the other.
     **/
    _renderAvatarItem(user) {
        return <TouchableOpacity style={styles.main_container}>
            <Image
                style={styles.image}
                source={require('../../Assets/Images/logo_batman.png')}
            />
            <View style={styles.content_container}>
                <View style={styles.header_container}>
                    <Text style={styles.title_text}>{user.name}</Text>
                </View>
                <View>
                    <Text style={styles.score_text}>Score: {user.points}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        const { user } = this.props
        return (
            <View>
                {this._renderAvatarItem(user)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'row'
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
    score_text: {
        fontSize: 16,
        color: '#666666'
    },
})

export default AvatarItem
