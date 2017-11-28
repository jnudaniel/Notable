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
import Lightbox from 'react-native-lightbox'; // 0.6.0
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

var image1 = require('../images/image1.jpeg')
var image2 = require('../images/image2.jpeg')
var image3 = require('../images/image3.jpeg')
var image4 = require('../images/image4.jpeg')
var image5 = require('../images/image5.jpeg')
var logo = require('../images/logo.jpeg')
var empty_image = ' '
var drawing = require('../images/image6.jpeg')

var number_slides = 5

const Cards = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "image": image1
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "image": image3
}, {
  "id": 3,
  "slide_title": "Ideate",
  "image": image4
}, {
  "id": 4,
  "slide_title": "Test",
  "image": image5
}, {
  "id": 5,
  "slide_title": "Point of View",
  "image": image2
}]

export default class NotesScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

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

  _loadStoredDrawings = async () => {
    try {
      for (let i = 0; i < number_slides; i++) {
        var value = i.toString() + 'drawing';
        var storedDrawing = await AsyncStorage.getItem(value);
        if (storedDrawing != null && storedDrawing != undefined) {
          this.setState({['drawings' + i]: storedDrawing});
        } else {
          this.setState({['drawings' + i]: drawing});
        }
      }
    } catch (error) {
      console.log('Error fetching stored drawings from AsyncStorage')
    }
  }

  constructor(props) {
    super(props);
    for (var i = 0; i < number_slides; i++) {
      this.state = {[i]: ' '};
      this.state = {['drawings' + i]: drawing};
    }
    this._loadStoredText();
    this._loadStoredDrawings();
    this.saveNotes = this.saveNotes.bind(this)
    // console.log('done in notes constructor')
  }

  _myRocketFunction = () => {
    alert('Here is rocket tab!');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      this._loadStoredText()
    }
  }

  render() {
    var slide_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = Cards[i]
      var value = 'drawings' + i
      var drawing = this.state[value]
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
           <Lightbox backgroundColor='white' underlayColor='white' style={{position: 'absolute', width:100, height:100, top:0, right:0}} activeProps={
                        {
                            style: {
                                width: 350,
                                height: 500,
                            },
                            resizeMode: 'contain'
                        }
                    }>
              <Image source={x.image} resizeMode="contain" style ={{width:100, height:100}} />
           </Lightbox>
           <Lightbox backgroundColor='white' underlayColor='white' style={{position: 'absolute', width:100, height:100, bottom:0, right:0}} activeProps={
                        {
                            style: {
                                width: 350,
                                height: 500,
                            },
                            resizeMode: 'contain'
                        }
                    }>
              <Image source={drawing} resizeMode="contain" style ={{width:100, height:100, bottom:0, right:0}} />   
           </Lightbox>
        </View>
        )
    }
    // console.log("render was called in notes screen!")
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <FontAwesome name="angle-right" size={45} color={Colors.noticeText} style={styles.leftSwipe}/>
          <Image style={styles.navBar} source={logo} resizeMode="contain" />  
        </View>
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
  navBar: {
    flex: 1,
    paddingTop: 30,
    height: 64,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  leftSwipe: {
    position: 'absolute',
    left: 15,
    top: 7,
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