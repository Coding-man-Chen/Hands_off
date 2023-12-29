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
          <Text style={stylesText.title}>Hinweis:</Text>
          <View style={{position:'absolute', top:Dimensions.get('window').height*0.10}}>
            <View style={styles.text}>
            <Text style ={stylesText.text}>
            Bediene dein Smartphone nur während du stehst. Unser Gerät dient der Steuerung von Smartphonefunktionen, für welche du keine optische Rückmeldung brauchst (d.h. Anrufe annehmen/ablehnen, Musik- und Audiofunktionen, Wake). {"\n"} 

Wähle Musik bevor du losfährst und steuere Sie während der Fahrt über unser Gerät.  {"\n"}

Ebenso wähle deine Navigation bevor du los fährst. Mit unserem Gerät kannst du einfach deinen Bildschirm aufwecken um deine Navigation zu prüfen. Du kannst aber nicht die Route ändern. Halte dafür an, ändere die Route und fahr anschließend entspannt und sicher weiter.{"\n"}  

 

Unsere Anwendung sammelt keinerlei Nutzerdaten, bitte erlaube die Steuerung von Telefonfunktionen um Anrufe verwalten zu können. Wir greifen weder deine Kontakte noch deine Anrufe ab
            </Text>
            </View>
          </View>
          <View style={{alignItems:'center',position:'relative',top:Dimensions.get('window').height*0.42}}>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Guideline')} style={stylesButton.main}>
              <Text style={stylesButton.main_text}>Einverstanden</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

// Style of this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#4F56AA',
    padding: 0,
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
    left:50,
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
    top:-300,
    left:20,
  },
  text: {
    color:'white',
    fontSize:18,
    position:'relative',
    top:50,
    right:10,
    textAlign:'justify',
    width:Dimensions.get('window').width*0.8
  }
})
const stylesButton = StyleSheet.create({
  main:{
    backgroundColor: '#00064d',
    height: 50,
    width:140,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main_text:{
    color:'white',
    fontWeight:'500',
    fontSize:16,
  },
  skip:{
    backgroundColor: '#00064d',
    opacity:1,
    height: 40,
    width:120,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top:20,
    right:20,
  }
})




