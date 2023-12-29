import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import Constants from 'expo-constants';
import Swiper from 'react-native-swiper';
import {NativeModules} from 'react-native';
const {CalenderModule} = NativeModules;


export default class Page1 extends React.Component {
  render() {
    return (
        <View style={styles.container}>
            <Image source={require('./source/answerCall.jpg')} style={stylesImage.container}  resizeMode="stretch"></Image>
        </View>
    );
  }
}

// Style of this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
    padding: 0,
    margin: 0,
  },
});
const stylesImage = StyleSheet.create({
  container: {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    backgroundColor:"#EFEFF0",
  }
});



