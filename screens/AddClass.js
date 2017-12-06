import React, { Component } from 'react';
import { View, StyleSheet,Image, Text, TextInput } from 'react-native';
import { Constants } from 'expo';
import { Button,Icon } from 'react-native-elements'
import { Ionicons, FontAwesome} from '@expo/vector-icons';


var image2 = require('../images/image2.jpeg')


export default class App extends Component {
  constructor(props) {
  super(props);
  this.state = {
    status: false,
  }

  }


  _handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  toggleStatus(){
     this.setState({
       status:!this.state.status
     });
     console.log('toggle button handler: '+ this.state.status);
   }



  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.header}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#FBF272' }} /> T  A  B  L  E </Text>

      <Text style={styles.text}> Enter your university </Text>
        <TextInput
          onChangeText={this._handleTextChange}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />
           <Text style={styles.text}> Enter your class </Text>
        <TextInput
          onChangeText={this._handleTextChange}
          style={{ alignSelf: 'center', width: 200, height: 44, padding: 8, borderWidth: 1, borderColor: 'black' }}
        />

        <Button
          title="Submit"
          backgroundColor = '#637898'
          buttonStyle={{padding: 10}}
          containerViewStyle={{padding: 10, borderRadius: 10}}

          onPress={()=>this.toggleStatus()}
         />

          { this.state.status &&
            <View>
            <Text style={{fontSize: 20, paddingBottom: 20}}>Here are lectures matching your selection: </Text>

            <View style ={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

            <Text style={{fontSize: 15, paddingBottom: 20}}>Lecture 2: User Interviews </Text>
            <Image style={{width: 300, height: 300}} source={image2}/>
            </View>
            </View>

          }

      </View>
    );
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
});
