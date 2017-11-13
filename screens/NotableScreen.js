import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

export default class NotableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

_handlePress() {
    console.log('Pressed!');
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type your notes here!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
        {(this.state.text == '#what') ? (
          'exam is on nov 12'
        ) :
          ' '}
        </Text>
      </View>
    );
  }
}

// skip this line if using Create React Native App
// AppRegistry.registerComponent('AwesomeProject', () => PizzaTranslator);