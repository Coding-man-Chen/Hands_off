import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Page1 from './components/guideline';
import Guideline_2 from './components/guideline_2';
import Guideline_3 from './components/guideline_3';
import Guideline_4 from './components/guideline_4';
import Page5 from './components/main_page';
import Navigation from './components/navigation';
import Spotify from './components/spotify';
import ComingCall from './components/comingCall';
import AnswerCall from './components/answerCall';
import {NavigationContainer,createNavigationContainerRef} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceEventEmitter } from 'react-native';

//My snacks are at: https://expo.io/snacks/@uni

const Stack = createNativeStackNavigator();

const navigationRef = createNavigationContainerRef();

function rootNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export default class App extends React.Component {
  state = {
    page: 1,
    options: ['Wake','Play/Annehmen','Zurück','Maps','Vorwärts/Weiter'],
    appState: false,
    connectionState: false
  };

  changeSaveOptions = (newOptions) =>{
    this.setState({options:newOptions})
  };

  // create page
  componentDidMount = () =>{
    this.listener = DeviceEventEmitter.addListener('changeApp',(buttonNumber)=>{
        rootNavigate(this.state.options[buttonNumber],{userName:'test'});
    })
    this.listener_2 = DeviceEventEmitter.addListener('connectionState',(ifConnection)=>{
      console.log('trigger');
      this.setState({connectionState:ifConnection});
  })
  }
  componentWillUnmount = () =>{
    if(this.listener){
      this.listener.remove();
    }
    if(this.listener_2){
      this.listener_2.remove();
    }
  }
  render() {
    return (
      <NavigationContainer  ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" savedOptions={this.state.options} >
        <Stack.Screen name="Navigation" component={Navigation} options={{headerShown: false}}/>
        <Stack.Screen name="Guideline_2" component={Guideline_2} options={{headerShown: false}}/>
        <Stack.Screen name="Guideline_3" component={Guideline_3} options={{headerShown: false}}/>
        <Stack.Screen name="Guideline_4" component={Guideline_4} options={{headerShown: false}}/>
        <Stack.Screen name="Guideline" component={Page1} options={{headerShown: false}}/>
        <Stack.Screen name="MainPage" options={{headerShown: false}}>
          {(props) => <Page5  savedOptions={this.state.options} changeSaveOptions={this.changeSaveOptions} connectionState={this.state.connectionState} {...props}/>}
        </Stack.Screen>
        <Stack.Screen name="Turn on music" component={Spotify} options={{headerShown: false}}/>
        <Stack.Screen name="Coming Call" component={ComingCall} options={{headerShown: false}}/>
        <Stack.Screen name="Answer call" component={AnswerCall} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
    padding: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});