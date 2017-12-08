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
    showModal: false,
    colleges: ['Stanford University', 'University of Michigan', 'Arizona State University', 'University of California San Diego', 'University of California Berkeley'],
    colleges_query: '',
    classes: ['CS 110', 'CS 107', 'ARTHIST 101', 'FILM 45Q', 'MATH 101', 'MATH 120'],
    class_query: '',
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


  render_modal = () => {
    return (
      <Modal isVisible={this.state.visibleModal} >
        <View style={styles.modalContent}>
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
            title="Close"
            onPress={() => this.setState({ visibleModal: false })}
            backgroundColor = '#FF6347'
            icon={{name: 'edit'}}
            buttonStyle={styles.buttonTags}
          />
        </View>
      </Modal>
      )
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.header}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#FBF272' }} /> T  A  B  L  E </Text>
      {this.render_modal()}
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
