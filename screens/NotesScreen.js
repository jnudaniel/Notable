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
  Switch,
} from 'react-native';
import { WebBrowser } from 'expo';
import Nav from './global-widgets/nav'
import SwipeCards from 'react-native-swipe-cards';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';
import Lightbox from 'react-native-lightbox'; // 0.6.0
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

var image1 = require('../images/image1.jpeg')
var image2 = require('../images/image2.jpeg')
var image3 = require('../images/image3.jpeg')
var image4 = require('../images/image4.jpeg')
var image5 = require('../images/image5.jpeg')
var logo = require('../images/puzzle_piece.png')
var empty_image = ' '
var drawing = require('../images/image6.jpeg')

var number_slides = 5
var class_name = "CS147"
var notes_name = "Lecture 2: User Interviews"

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

Format = (props) => {
  const possTags = ["#def", "#section", "#important", "#exam"];
  const means = ["definition", "Section", "Imp", "Exam"]
  const currLine = props.line;
  const toFormat = currLine[0] == '#';
  if(!toFormat) {  <Text> {props.line} </Text> }

  const tag = currLine.split(" ", 1)[0];
  const content = currLine.substring(currLine.indexOf(" "));

  switch (possTags.indexOf(tag)) {
    case 0: return <Text style={styles.definitionText}> {content}{'\n'}</Text>;
    case 1: return <Text style={styles.sectionText}>{content}{'\n'}</Text>;
    case 2: return <Text style={styles.importantText}> {content}{'\n'}</Text>;
    case 3: return <Text style={styles.examText}> {content}{'\n'}</Text>;

  }

  return <Text> {props.line}{'\n'} </Text>;
}
key_val = 0

ViewNotes = (props) => {
  if (props.toFormat) {
  const lines = String(props.text).split('\n');
  key_val = key_val + 1
  const listItems = lines.map((line) => 
    <Format key={line + Math.random()} line = {line}> </Format>
  );
return (
    <Text key={key_val}>{listItems}</Text>
  );
  }


}

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
    // this.saveNotes = this.saveNotes.bind(this);
    this.viewFormat = true;
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

  NotesView = (isOn) => {
  return <Text>{this.state.eventSwitchRegressionIsOn ? 'On' : 'Off'}</Text>

  } 



  render() {
    var slide_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = Cards[i]
      var value = 'drawings' + i
      var drawing = this.state[value]
      slide_notes.push(
        <View key={i} style={styles.card}>
          <Text style={styles.slide_title}> {x.slide_title} </Text>
          <TextInput
            style={styles.noteInput}
            ref={i}
            multiline={true}
            autogrow={true}
            placeholder="Start taking notes..."
            onChangeText={ (text) => {
              this.setState({[i]: text}) }}
            value={this.state[i]}
            onEndEditing={(e)=>{this.saveNotes(e, i)}}
          />
          <ViewNotes key={i} text = {this.state[i]} toFormat = {this.viewFormat}/>
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
        <View style={styles.padding_header}></View>
        <View style={styles.header}>
          <Image style={styles.navBar} source={logo} resizeMode="contain" />  
        </View> 
        <Text style={styles.class_name}> {class_name} </Text>
        <Text style={styles.notes_name}> {notes_name} </Text>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
          {slide_notes}
        </ScrollView>
      </View>
    );
  }

  saveNotes = async (e, i) => {
    console.log('attempting to save notes');
    try {
      await AsyncStorage.setItem(i.toString(), this.state[i]);
      // this.refs[i].setNativeProps({text: ''})
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage')
    }
    console.log('succesful at saving notes')
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  class_name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  notes_name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  slide_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  definitionText: {
    fontWeight: 'bold',
    color: 'rgb(252, 7, 7)',
  },
  sectionText: {
    fontWeight: 'bold',
    color: 'rgb(244, 153, 17)',
  },
  importantText: {
    fontWeight: 'bold',
    color: 'rgb(15, 193, 39)',
  },
  examText: {
    fontWeight: 'bold',
    color: 'rgb(84, 94, 247)',
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
    height: 50,
    backgroundColor: '#eae8e8',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    borderBottomWidth:.5,
    borderColor:'#b2bab7',
    backgroundColor: '#eae8e8',
  },
  padding_header: {
    height: 20,
    flexDirection: 'column',
    backgroundColor: '#eae8e8',
  },
   card: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    borderWidth:2,
    borderColor:'#b2bab7',
    borderWidth:1,
    backgroundColor: '#f4f7f6',
    width: 350,
    height: 420,
  }
});