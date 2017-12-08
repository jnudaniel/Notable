import React, { Component } from 'react';
import { View, StyleSheet,Image, Text, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { Constants,Font } from 'expo';
import { Button,Icon } from 'react-native-elements'
import { Ionicons, FontAwesome} from '@expo/vector-icons';
import Nav from './global-widgets/nav'


var darkest_blue = '#0C0F2A';
var medium_blue = '#667797';
var light_blue = '#C9DCED';
var yellow = '#FAF57E';
var white = '#FFFFFF';


export default class App extends Component {



  constructor(props) {
  super(props);
  this.state = {
    status: false,
    login: true,
    email: '',
    password: '',
    repeat: '',
  }

  }

   addToStoreEmail = async () => {
    console.log('attempting to save email');
    try {
      await AsyncStorage.setItem("email", this.state.email);
    } catch (error) {
      console.log('Unable to save email to AsyncStorage');
    }
  };

  toggleStatus(){
     this.setState({
       status:!this.state.status
     });
     console.log('toggle button handler: '+ this.state.status);
   }

   render_login() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.paddingAboveHeader}></View>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require('../images/logo-notable-med.png')} />
          </View>
      <Text style={styles.text}>Email</Text>
        <TextInput style={styles.inputField}
          onChangeText={ (text) => {this.setState({email: text}) }}

        />
           <Text style={styles.text}> Password </Text>
        <TextInput secureTextEntry={true} style={styles.inputField}
          onChangeText={ (text) => {this.setState({password: text}) }}

        />

        <Button
          title="Submit"
          disable = {this.state.email == ''}
          backgroundColor = '#637898'
          buttonStyle={{padding: 10}}
          containerViewStyle={{padding: 10, borderRadius: 10}}

          onPress={()=> {navigate('Notes');}}
         />

        <TouchableOpacity
          style={{padding: 20}}
          onPress={() => this.setState({login:false})} >
          <Text>Or create an account</Text>
        </TouchableOpacity>
        </View>
      </View>
    );

   }

  render_signup() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.paddingAboveHeader}></View>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require('../images/logo-notable-med.png')} />
          </View>

          <Text style={styles.text}>Email</Text>
          <TextInput
            onChangeText={ (text) => {this.setState({username: text}) }}
            style={styles.inputField}
          />
             <Text style={styles.text}> Password </Text>
          <TextInput
            secureTextEntry={true} style={styles.inputField}
            onChangeText={ (text) => {this.setState({password: text}) }}

          />

          <Text style={styles.text}> Repeat Password </Text>
          <TextInput
          secureTextEntry={true} style={styles.inputField}
            onChangeText={ (text) => {this.setState({repeat: text}) }}

          />
          <Text> {this.state.email} </Text>
          <Button
            title="Join"
            disable = {(this.state.email.length) == 0}
            backgroundColor = '#637898'
            buttonStyle={{padding: 10}}
            containerViewStyle={{padding: 10, borderRadius: 10}}

            onPress={()=> {this.addToStoreEmail();
              navigate('Notes');}}
           />

          <TouchableOpacity
            style={{padding: 20}}
            onPress={() => this.setState({login:true})} >
              <Text>Sign in with an existing account</Text>
            </TouchableOpacity>

        </View>
      </View>
    );

   }


  render() {
    if(this.state.login) {
      return (this.render_login());
    } else {
      return (this.render_signup())
    }
  }
}
///
const styles = StyleSheet.create({
  paddingAboveHeader: {
    height: 20,
    backgroundColor: '#eae8e8',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: light_blue,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    width: '100%',
    margin: 30,
  },
  logoContainer: {
    width: 550,
    height: 200,
    //flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 50,
  },
  text: {
    paddingTop: 20,
    paddingBottom: 10,
    color: 'black',
  },
  inputField: {
    alignSelf: 'center',
    width: 250,
    height: 45,
    padding: 8,
    borderWidth: 3,
    borderColor: medium_blue,
    borderRadius: 7,
  },
  header :{
    fontSize: 50,
    color: 'black',
  },
   modalContent:{
    width:500,
    height:500,
    borderWidth:10,
    color: '#f0f',
    borderColor:'#e7e7e7',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:40
  },
});
