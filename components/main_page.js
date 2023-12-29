import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Octicons';
import ModalDropdown from 'react-native-modal-dropdown';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import {NativeModules} from 'react-native';
import { CommonActions } from '@react-navigation/native';
var {CalenderModule} = NativeModules;
const resetAction = CommonActions.reset({
  index: 0,
  routes: [{ name: 'Guideline'}],  
})

// Array of functions
const options = ['Turn on music','Play/Pause Annehmen/Auflegen','Turn off music','Answer call','Screen call'];

var status = 0;
const createCalenderEventPromise = async() =>{
  try{
    var result = await CalenderModule.createCalenderPromise();
    status = Number(result)
  }catch(e){
  }
}

export default class Page2 extends React.Component {
  // Initial state
  state= {
    visible: false,
    errorVisible: false,
    currentOptions:this.props.savedOptions,
    height:[0,0,0,0,0]
  }; 
  // Notification of save
  clearNotification = () => {
    setTimeout(()=>{
      this.setState({
        visible: false,
        errorVisible: false,
      })
    },2000)
  }
  sendArrayBack = () => {
    var backData = {};
    backData = this.state.currentOptions;
    CalenderModule.createCalenderEvent(backData)
  }
  optionsChange_0 = (index,value) => {
    var newOptions=[...this.state.currentOptions];
    newOptions[0]=value,
    this.setState({
      currentOptions:newOptions
    })    
  }
  optionsChange_1 = (index,value) => {
    var newOptions=[...this.state.currentOptions];
    newOptions[1]=value,
    this.setState({
      currentOptions:newOptions
    })      
  }
  optionsChange_2 = (index,value) => {
    var newOptions=[...this.state.currentOptions];
    newOptions[2]=value,
    this.setState({
      currentOptions:newOptions
    })    
  }
  optionsChange_3 = (index,value) => {
    var newOptions=[...this.state.currentOptions];
    newOptions[3]=value,
    this.setState({
      currentOptions:newOptions
    })      
  }
  optionsChange_4 = (index,value) => {
    var newOptions=[...this.state.currentOptions];
    newOptions[4]=value,
    this.setState({
      currentOptions:newOptions
    })      
  }
  
  componentDidMount = () => {
    createCalenderEventPromise();
  }
  componentWillUnmount = () =>{
    if(new Set(this.state.currentOptions).size===this.state.currentOptions.length)
    {
      this.props.changeSaveOptions(this.state.currentOptions)
    }
  }

  render() {
    return (
      // Switch to guideline
      <View style={styles.container}>
        <TouchableOpacity onPress={()=> this.props.navigation.dispatch(resetAction)} style={stylesIcon.icon}>
          <Icon name='question' size={30} color='#4f56aa'/>
        </TouchableOpacity>
        {/* Connection status */}
        <View style={stylesStatus.title}>
          <Text style={stylesStatus.text}>
            Verbindungsstatus
          </Text>
        </View>
        <View style={stylesStatus.content}>
          {this.props.connectionState===true?(
            <View>
              <Icon name='dot-fill' size={20} color='#f5a100'/>
              <Text style={stylesStatus.content_text}>Gerät nicht gefunden</Text>
            </View>
          ) : 
            <View>
            <Icon name='dot-fill' size={20} color='#36A18B'/>
            <Text style={stylesStatus.content_text}>Gerät verbunden</Text>
            </View>
          }   
          
          
        </View>
        {/* Button customization */}
        <View style={stylesCustom.title}>
          <Text style={stylesCustom.text}>
            Funktionsübersicht
          </Text>
        </View>
        <View style={{position:'relative',bottom:Dimensions.get('window').height*0.1}}>
          <View style={{top:(Dimensions.get('window').height)*0,flex:1,flexDirection:'row',position:'absolute',justifyContent:'space-between',width:(Dimensions.get('window').width),paddingLeft:10,paddingRight:10}}>
            <ModalDropdown disabled={true} options={[]}  style={stylesCustom.dropdown} textStyle={stylesCustom.droptext} isFullWidth={true} defaultValue={this.props.savedOptions[0]}  showsVerticalScrollIndicator={true} dropdownStyle={stylesCustom.dropdownStyle} onSelect={this.optionsChange_0} adjustFrame={(style)=>{
              style.left=10
              return style;
            }}
            ></ModalDropdown>
            <ModalDropdown disabled={true} options={[]}  style={[stylesCustom.dropdown]} textStyle={stylesCustom.droptext} isFullWidth={true} defaultValue={this.props.savedOptions[1]}  showsVerticalScrollIndicator={true} dropdownStyle={stylesCustom.dropdownStyle} onSelect={this.optionsChange_1} adjustFrame={(style)=>{
              style.left= ((Dimensions.get('window').width)-Dimensions.get('window').width/3.5)/2
              return style;
            }}></ModalDropdown>
            <ModalDropdown disabled={true} options={[]}  style={[stylesCustom.dropdown]} textStyle={stylesCustom.droptext} isFullWidth={true} defaultValue={this.props.savedOptions[2]} showsVerticalScrollIndicator={true} dropdownStyle={stylesCustom.dropdownStyle} onSelect={this.optionsChange_2} adjustFrame={(style)=>{
              style.right=10
              return style;
            }}></ModalDropdown>
          </View>
          <View style={stylesCustom.image}>
            <Image source={require('./source/product.png')} resizeMode={'contain'}>
            </Image>
          </View>
          <View style={{top:(Dimensions.get('window').height*0.05+240),flex:1,flexDirection:'row',position:'absolute',justifyContent:'space-between',width:(Dimensions.get('window').width),paddingLeft:70,paddingRight:70}}>
            <ModalDropdown options={['Maps','Kamera','Alexa','Excel','Calculator']}  style={stylesCustom.dropdown} textStyle={stylesCustom.droptext} isFullWidth={true} defaultValue={this.props.savedOptions[3]} showsVerticalScrollIndicator={true} dropdownStyle={stylesCustom.dropdownStyle} onSelect={this.optionsChange_3} adjustFrame={(style)=>{
              style.left=70
              return style;
            }}></ModalDropdown>
            <ModalDropdown  disabled={true} options={[]}style={[stylesCustom.dropdown]} textStyle={stylesCustom.droptext} isFullWidth={true} defaultValue={'Weiter'} showsVerticalScrollIndicator={true} dropdownStyle={stylesCustom.dropdownStyle} onSelect={this.optionsChange_4} adjustFrame={(style)=>{
              style.right=70
              return style;
            }}></ModalDropdown>
          </View>
        </View>
        {/* Save button */}
        <View style={{alignItems:'center',position:'absolute',left:(Dimensions.get('window').width-97)/2,bottom:50}}>
            <TouchableOpacity style={stylesButton.main} onPress={()=> {
              if(new Set(this.state.currentOptions).size===this.state.currentOptions.length)
              {
                  this.setState({visible:true},
                  this.clearNotification()),
                  this.sendArrayBack();
              }
              else{
                this.setState({errorVisible:true},
                this.clearNotification());
              }
              } }>
              <Text style={stylesButton.main_text}>Speichern</Text>
            </TouchableOpacity>
        </View>
        {/* Notification dialog */}
        <Dialog 
          visible={this.state.visible}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          onTouchOutside={() => {
            this.setState({ visible: false });
          }}
          overlayBackgroundColor='white'
          overlayOpacity={0}
          containerStyle={{justifyContent: 'flex-end',marginBottom:110}}
          rounded={false}
        >
          <DialogContent style={stylesDialog.content}>
             <Icon name='check-circle' size={20} color='#00CC52' style={{position:'relative',top:12}}/>
             <Text style={{position:'relative',top:12}} >Erfolgreich speichern </Text>
          </DialogContent>
        </Dialog>
        <Dialog 
          visible={this.state.errorVisible}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          onTouchOutside={() => {
            this.setState({ visible: false });
          }}
          overlayBackgroundColor='white'
          overlayOpacity={0}
          containerStyle={{justifyContent: 'flex-end',marginBottom:110}}
          rounded={false}
        >
          <DialogContent style={stylesDialog.content_error}>
             <Icon name='x-circle' size={20} color='#f5a100' style={{position:'relative',top:12}}/>
             <Text style={{position:'relative',top:12,right:0}} >Fehler: Knöpfe haben gleiche Funktionen</Text>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

// Style of this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    backgroundColor:'white',
  },
});
const stylesIcon = StyleSheet.create({
  icon: {
    position: 'absolute',
    top:50,
    right:20,
  }
});
const stylesStatus = StyleSheet.create({
  title: {
    position:'absolute',
    top:120,
    left:30,
  },
  text: {
    fontSize:20,
    fontWeight:'700',
  },
  content:{
    justifyContent:'center',
    flex:1,
    flexDirection:'row',
    position:'relative',
    top:160,
  },
  content_text: {
    marginLeft:20,
    fontSize:16,
    fontWeight:'500',
    position:'relative',
    bottom:22,
  }
});

const stylesCustom = StyleSheet.create({
    title: {
      position:'absolute',
      top:Dimensions.get('window').height*0.35,
      left:30,
    },
    text: {
      fontSize:20,
      fontWeight:'700',
    },
    image: {
      position:'relative',
      top:(Dimensions.get('window').height)*0.05,
      height:(Dimensions.get('window').height)*0.5,
      left:(Dimensions.get('window').width-360)/2,
    },
    dropdown: {
      borderWidth:1,
      height:Dimensions.get('window').height*0.05,
      width: Dimensions.get('window').width/3.5,
      borderColor:'#D9D9D9',
      paddingLeft: 10,
      justifyContent: 'center',
      borderRadius:10,
    },
    droptext: {
      size:20,
      fontWeight:'500'
    },
    dropdownStyle: {
      borderColor:'#D9D9D9',
      borderWidth:1,
      borderBottomRightRadius:10,
      borderBottomLeftRadius:10,
      height:120
    },
});
const stylesButton = StyleSheet.create({
  main:{
    backgroundColor: '#4f56aa',
    height:50,
    width:97,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main_text:{
    color:'white',
    fontWeight:'500',
    fontSize:16,
  }
})
const stylesDialog = StyleSheet.create({
  content:{
    borderWidth:1,
    width:200,
    borderColor:'#D9D9D9',
    flexDirection:'row',
    justifyContent:'space-between',
    borderRadius:5
  },
  content_error:{
    borderWidth:1,
    width:320,
    borderColor:'#D9D9D9',
    flexDirection:'row',
    justifyContent:'space-between',
    borderRadius:5
  }
});