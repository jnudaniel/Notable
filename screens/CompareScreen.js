import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
  Dimensions,
  Button
} from 'react-native';

var number_slides = 5;
var logo = require('../images/logo.jpeg')
var constructed = 0

const combined_notes = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "notes": "Hall of shame"
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "notes": "Hall of shame"
}, {
  "id": 3,
  "slide_title": "Ideate",
  "notes": "Hall of shame"
}, {
  "id": 4,
  "slide_title": "Test",
  "notes": "Hall of shame"
}, {
  "id": 5,
  "slide_title": "Point of View",
  "notes": "Hall of shame"
}]

export default class NotableScreen extends Component {
  constructor(props) {
    super(props);
    for (var i = 0; i < number_slides; i++) {
      this.state = {[i]: ' '};
    }
    this._loadStoredText();
  }

  _loadStoredText = async () => {
    try {
      for (let i = 0; i < number_slides; i++) {
        var value = i.toString();
        var storedText = await AsyncStorage.getItem(value);
        if (storedText != null && storedText != undefined) {
          this.setState({[i]: storedText});
        } else {
          this.setState({[i]: " "});
        }
      }
    } catch (error) {
      console.log('Error fetching stored notes from AsyncStorage')
    }
  }
  static navigationOptions = {
    header: () => null,
  };

  render() {
    var personal_notes = [];
    var class_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = combined_notes[i]
      class_notes.push(
        <View key={i} style={styles.card}>
          <Text> {x.slide_title} </Text>
          <Button
            onPress = { this.saveNotes }
            title={x.notes}
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        )
      personal_notes.push(
        <View key={i} style={styles.card}>
          <Text> {x.slide_title} </Text>
          <Text> {this.state[i]} </Text>
        </View>
        )
    }
    console.log("render was called here!")
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.navBar} source={logo} resizeMode="contain" />  
        </View> 
        <View style={styles.context}>
            <View style={[styles.box, styles.box1]}>
              <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                 <Text>My Notes</Text>
                {personal_notes}
              </ScrollView>
            </View>
            <View style={[styles.box, styles.box2]}>
              <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                <Text>Class Notes</Text>
                {class_notes}
              </ScrollView>
            </View>
        </View>
      </View>
    );
  }

  saveNotes = async () => {
    console.log('attempting to save notes');
    try {
      for (let i = 0; i < number_slides; i++) {
        await AsyncStorage.setItem(i.toString(), this.state[i]);
      }
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage')
    }
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flex: 1,
    paddingTop: 30,
    height: 64,
    backgroundColor: 'black',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    borderWidth:2,
    borderColor:'#e3e3e3',
    width: 350,
    height: 420,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContentContainer: {
    paddingTop: 30,
  },
  navBarButton: {
    color: '#FFFFFF',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  context: {
    flex: 1,
    flexDirection: 'row'
  },
  notes: {
    flex:1,
    flexDirection: 'column'
  },
  box: {
    flex: 1,
    borderWidth:2,
    borderColor:'#e3e3e3',
  },
  box1: {
      backgroundColor: '#EFDDC9'
  },
  box2: {
      backgroundColor: '#F0DCCA'
  },
});