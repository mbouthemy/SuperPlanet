// Components/ViewPDF.js

import React, {useState} from 'react';
import {
    Button,     StyleSheet,
    Switch,
    Text,     View} from 'react-native';
import Pdf from 'react-native-pdf';

class ViewPDF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uri: this.props.route.params.sourcePDF,
        };
    }


    render() {
        const sourcePDF = {uri:this.state.uri, cache: true};
        return (
            <View style={{flex: 1}}>
                <Pdf ref={(pdf)=>{this.pdf = pdf;}}
                     source={sourcePDF}
                     style={{flex: 1}}
                     onError={(error)=>{console.log(error);}} />
            </View>
        );
    }
}



const styles = StyleSheet.create({
});


const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action); },
    };
};

export default ViewPDF;
