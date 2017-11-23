import React from 'react';
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
} from 'react-native';
import { WebBrowser } from 'expo';
import Nav from './global-widgets/nav'
import SwipeCards from 'react-native-swipe-cards';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';

var image1 = require('../images/image1.jpeg')
var image2 = require('../images/image2.jpeg')
var image3 = require('../images/image3.jpeg')
var image4 = require('../images/image4.jpeg')
var image5 = require('../images/image5.jpeg')

var number_slides = 5

const Cards = [{
  "id": 1,
  "slide_title": "Biology is the study of LIFE",
  "image": image1
}, {
  "id": 2,
  "slide_title": "Big idea 1",
  "image": image2
}, {
  "id": 3,
  "slide_title": "Big idea 2",
  "image": image3
}, {
  "id": 4,
  "slide_title": "Big idea 3",
  "image": image4
}, {
  "id": 5,
  "slide_title": "Big idea 4",
  "image": image5
}]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };



  _loadStoredText = async () => {
    try {
      for (let i = 0; i < number_slides; i++) {
        var value = i.toString();
        var storedText = await AsyncStorage.getItem(value);
        if (storedText != null) {
          this.setState({[i]: storedText});
        }
      }
    } catch (error) {
      console.log('Error fetching stored notes from AsyncStorage')
    }
  }

  constructor(props) {
    super(props);
    for (let i = 0; i < number_slides; i++) {
      this.state = {[i]: 'a'};
    }
    this._loadStoredText();
    console.log('done in constructor')
  }

  render() {
    var slide_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = Cards[i]
      slide_notes.push(
        <View key={i} style={styles.card}>
          <Text> {x.slide_title} </Text>
          <TextInput
            style={styles.noteInput}
            multiline={true}
            autogrow={true}
            placeholder="Start taking notes..."
            onChangeText={ (text) => {
              this.setState({[i]: text}) }}
            value={this.state[i]}
            onEndEditing={this.saveNotes}
          />
          <Image source ={x.image} resizeMode="contain" style ={{width:100, height:100, position: "absolute", top: 0, right: 0}} />
        </View>
        )
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
          {slide_notes}
        </ScrollView>
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

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };
  
  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContentContainer: {
    paddingTop: 30,
  },
  noteInputContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  noteInput: {
    width: 350,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'left',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  buttons:{
    width:80, 
    height:80, 
    borderWidth:10, 
    borderColor:'#e7e7e7', 
    justifyContent:'center', 
    alignItems:'center',
    borderRadius:40
  },
  buttonSmall:{
    width:50, 
    height:50, 
    borderWidth:10, 
    borderColor:'#e7e7e7', 
    justifyContent:'center', 
    alignItems:'center',
    borderRadius:25
  },
   card: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    borderWidth:2,
    borderColor:'#e3e3e3',
    width: 350,
    height: 420,
  }
});