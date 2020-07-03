import {ActivityIndicator, StyleSheet, View} from "react-native";
import React from "react";

/**
 * Return the date formatted.
 */
export function getFormattedDate(image=false): string {
    const date = new Date();
    const month = fixDateFormat(date.getMonth());
    const day = fixDateFormat(date.getDate());
    const hour = fixDateFormat(date.getHours());
    const minute = fixDateFormat(date.getMinutes());
    const seconds = fixDateFormat(date.getSeconds());

    if (image){
        return String(date.getFullYear()) + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + seconds + '.png'
    }
    return String(date.getFullYear()) + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + seconds;
}

/**
 * Fix the bug when saving the date.
 */
function fixDateFormat(date: number): string {
    if (date < 10) {
        return '0' + date;
    } else {
        return date.toString();
    }
}


/**
 * Compute the distance in KM between two pairs of points.
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


export const imagePickerOptions = {
    noData: true,
    maxWidth: 400,
    maxHeight: 400
};


export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export function convertDateFormatToSeconds(date: string){
    const dateMinutesSeconds = date.slice(-8).split('_');
    return dateMinutesSeconds[0]*3600 + dateMinutesSeconds[1]*60 + dateMinutesSeconds[2]*1
}

export function renderLoading(isLoading) {
    if (isLoading) {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large' />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F3F3'
    },
})
