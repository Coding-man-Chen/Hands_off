import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, Button} from 'react-native';
import Constants from 'expo-constants';
import Swiper from 'react-native-swiper';
import {NativeModules} from 'react-native';
import { DeviceEventEmitter } from 'react-native';
const {CalenderModule} = NativeModules;


export default class Page1 extends React.Component {
  render() {
    return (
        <View style={styles.container}>
        <TouchableOpacity  style={stylesButton.skip}>
              <Text style={stylesButton.main_text}></Text>
        </TouchableOpacity>
          <View style={styles.image}>
            <Image source={require('./source/4.png')} style={stylesImage.container}></Image>
          </View>
          <Text style={stylesText.title}> Schritt 4</Text>
          <View style={{position:'absolute', top:Dimensions.get('window').height*0.40}}>
            <View style={styles.text}>
            <Text style ={stylesText.text}>
            Stelle Sicher das die Anwendung im Hintergrund ausgeführt wird und du diese nicht schließt. Hab Spaß und steure dein Smartphone mit dem HandsOff Controller.
            </Text>
            </View>
          </View>
          <View style={{alignItems:'center',position:'relative',top:Dimensions.get('window').height*0.27}}>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('MainPage')} style={stylesButton.main}>
              <Text style={stylesButton.main_text}>Steuer dein Smartphone</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

// Style of this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#4F56AA',
    paddingTop: 0,
    margin: 0,
  },
  image:{
    position:'absolute',
    top:(Dimensions.get('window').height)*0.15,
    width:200,
    left:(Dimensions.get('window').width-Dimensions.get('window').height*0.25)/2,
  },
  text:{
    position:'relative',
    top:40,
    width:250,
    left:(Dimensions.get('window').width-250)/2,
  }
});
const stylesImage = StyleSheet.create({
  container: {
    width:(Dimensions.get('window').height)*0.25,
    height:(Dimensions.get('window').height)*0.25,
    backgroundColor:"#EFEFF0",
    borderRadius:100
  }
});
const stylesText = StyleSheet.create({
  title: {
    color:'white',
    fontWeight:'600',
    fontSize:32,
    position:'relative',
    top:-30,
    left:20,
  },
  text: {
    color:'white',
    fontSize:20,
    position:'relative',
    top:50,
    right:10,
    textAlign:'justify',
    width:Dimensions.get('window').width*0.7
  }
})
const stylesButton = StyleSheet.create({
  main:{
    backgroundColor: '#00064d',
    height: 60,
    width:200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main_text:{
    color:'white',
    fontWeight:'500',
    fontSize:16,
  },
  skip:{
    opacity:1,
    height: 40,
    width:120,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top:50,
    right:20,
  }
})