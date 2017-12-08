import React, { Component } from 'react';
import { View, StyleSheet,Image, Text, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
import { Button,Icon } from 'react-native-elements'
import { Ionicons, FontAwesome} from '@expo/vector-icons';
import Nav from './global-widgets/nav'


var image2 = require('../images/image2.jpeg')


export default class App extends Component {
  constructor(props) {
  super(props);
  this.state = {
    status: false,
    login: false,
    email: '',
    password: '',
    repeat: '',
  }

  }

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
      <Text style={styles.header}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#FBF272' }} /> T  A  B  L  E </Text>
      <Text style={styles.text}> Email </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({email: text}) }}
            style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
           <Text style={styles.text}> Password </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({password: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
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
            onPress={() => this.setState({login:false})} >
            <Text>Or create an account</Text>
          </TouchableOpacity>

      </View>
    );

   }

  render_signup() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
      <Text style={styles.header}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#FBF272' }} /> T  A  B  L  E </Text>
      <Text style={styles.text}> Email </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({username: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
           <Text style={styles.text}> Password </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({password: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />

        <Text style={styles.text}> Repeat Password </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({repeat: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
        <Text> {this.state.email} </Text>
        <Button
          title="Join"
          disable = {(this.state.email.length) == 0}
          backgroundColor = '#637898'
          buttonStyle={{padding: 10}}
          containerViewStyle={{padding: 10, borderRadius: 10}}

          onPress={()=> {addToStoreEmail(): navigate('Notes');}}
         />

        <TouchableOpacity
            onPress={() => this.setState({login:true})} >
            <Text>Sign in with an existing account</Text>
          </TouchableOpacity>

      </View>
    );
    
   }

   addToStoreEmail = async () => {
    console.log('attempting to save email');
    try {
      await AsyncStorage.setItem("email", this.state.email);
    } catch (error) {
      console.log('Unable to save email to AsyncStorage');
    }
  };

  render() {
    if(this.state.login) {
      return (this.render_login());
    } else {
      return(
      <View style={styles.container}>
      <Text style={styles.header}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#FBF272' }} /> T  A  B  L  E </Text>
      <Text style={styles.text}> Email </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({username: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
           <Text style={styles.text}> Password </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({password: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />

        <Text style={styles.text}> Repeat Password </Text>
        <TextInput
          onChangeText={ (text) => {this.setState({repeat: text}) }}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
        <Text> {this.state.email} </Text>
        <Button
          title="Join"
          disable = {(this.state.email.length) == 0}
          backgroundColor = '#637898'
          buttonStyle={{padding: 10}}
          containerViewStyle={{padding: 10, borderRadius: 10}}

          onPress={()=> {navigate('Notes');}}
         />

        <TouchableOpacity
            onPress={() => this.setState({login:true})} >
            <Text>Sign in with an existing account</Text>
          </TouchableOpacity>

      </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#4682B4',
  },
  text :{
    paddingTop: 20,
    paddingBottom: 10,
    color: 'black',
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
