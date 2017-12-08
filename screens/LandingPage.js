import React, { Component } from 'react';
import { View, Alert, StyleSheet,Image,ScrollView, Text, TextInput, Dimensions} from 'react-native';
import { Constants } from 'expo';
import { Button,Icon } from 'react-native-elements'
import { Ionicons, FontAwesome} from '@expo/vector-icons';


var logo = require('../images/logo-notable.png')


export default class App extends Component {
  constructor(props) {
  super(props);
  this.state = {
    username: '',
    password: '',
  }
}

  checkInput = () =>{
    const { username }  = this.state ;
    const { password }  = this.state ;

    if(username == '' || password == '')
    {
      Alert.alert("Please enter all values.");
    }
    else{
    this.submit()
    }
}



  submit(){
     this.setState({
       status:!this.state.status
     });
   }



  render() {
    return (
      <View style={styles.container}>
      <View style={styles.box}>

      <Image style={{ width: 400, height: 300}} source={logo}/>

      <Text style={styles.text}> Log In </Text>

      <Text style={styles.inputText}>University Email:</Text>
        <TextInput
          onChangeText={(text) => this.setState({username:text})}
          style={{width: 200, height: 44, padding: 8, borderWidth: 3, borderRadius: 10, borderColor: '#667797' }}
        />

        <Text style={styles.inputText}>Password:</Text>
        <TextInput
          onChangeText={(text) => this.setState({password:text})}
          style={{ width: 200, height: 44, padding: 8, borderWidth: 3,borderRadius: 10, borderColor: '#667797' }}
        />

        <Button
          title="Log In"
          backgroundColor = '#FAF57E'
          color = 'black'
          fontWeight = 'bold'
          borderRadius = {10}
          buttonStyle={{width: 180}}
          containerViewStyle={{padding: 20, borderRadius: 10}}
          onPress={()=>this.checkInput()}
         />

          { this.state.status &&
            <View>
            <Text style={{fontSize: 12, color:'#637898'}}>Submitted</Text>
            </View>
          }
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9DCED',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    paddingTop: 50,
    paddingBottom: 50,
  },
  box: {
    flex: 1,
    height: Dimensions.get('window').height-70,
    width: Dimensions.get('window').width-70,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text :{
    fontSize: 30,
    marginTop: -110,
    marginBottom: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  inputText:{
    fontSize: 12,
    paddingTop: 12 ,
    color: 'black',
  },
  buttonText:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
});
