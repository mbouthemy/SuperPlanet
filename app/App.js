/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LeaderBoard from "./src/Views/LeaderBoard";
import StartMission from "./src/Views/StartMission";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from "./src/Views/Login";
import EndMission from "./src/Views/EndMission";
import ScoreResults from "./src/Views/ScoreResults";
import {persistStore} from "redux-persist";
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import { PersistGate } from 'redux-persist/es/integration/react'
import ViewPDF from "./src/ViewPDF";

const MainStack = createStackNavigator();

const Tab = createBottomTabNavigator();




/**
 * Create the TabNavigation composed of two parts: the Home and the Chat.
 * @returns {*}
 * @constructor
 */
function TabNavigation() {
  return (
      <Tab.Navigator
          initialRouteName = 'StartMission'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'LeaderBoard') {
                return <Icon name="trophy" size={size} color={color} />;
              } else if (route.name === 'StartMission') {
                return <Icon name="hourglass-start" size={size} color={color} />;
              }
              else if (route.name === 'EndMission') {
                return <Icon name="hourglass-end" size={size} color={color} />;
              }

              // You can return any component that you like here!
            },
          })}
          tabBarOptions={{
            activeTintColor: '#67e011',
            inactiveTintColor: 'gray',
            keyboardHidesTabBar: true,
          }}
      >
        <Tab.Screen name='LeaderBoard' component={LeaderBoard} options={{title: "Leaderboard"}}/>
        <Tab.Screen name='StartMission' component={StartMission} options={{title: "Start Mission"}}/>
        <Tab.Screen name='EndMission' component={EndMission} options={{title: "Finish Mission"}}/>
      </Tab.Navigator>
  );
}

function MainStackScreen() {
  return (
      <MainStack.Navigator
          initialRouteName='Login'
          navigationOptions = {{
            header: null,
          }}
      >
        <MainStack.Screen name='MainTab' component={TabNavigation} options={({ navigation, route }) => ({
          unmountInactiveRoutes: true,
          headerShown: false,
        })}/>
        <MainStack.Screen name='Login' component={Login} options={{
          headerShown: false
        }}/>
        <MainStack.Screen name='ScoreResults' component={ScoreResults} options={({ navigation, route }) => ({
          headerShown: false,
        })}/>
        <MainStack.Screen name="ViewPDF" component={ViewPDF} options={({ navigation, route }) => ({
          title: '',
        })}/>
          </MainStack.Navigator>
  );
}

export default function App() {
  let persistor = persistStore(Store)
  return (
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainStackScreen/>
          </NavigationContainer>
        </PersistGate>
      </Provider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
