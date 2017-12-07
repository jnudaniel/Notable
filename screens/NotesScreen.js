import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  AsyncStorage,
  Switch,
  Alert,
} from 'react-native';
import { WebBrowser, ImagePicker } from 'expo';
import Nav from './global-widgets/nav'
import SwipeCards from 'react-native-swipe-cards';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';
import Lightbox from 'react-native-lightbox'; // 0.6.0
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

var image1 = require('../images/image1.jpeg')
var image2 = require('../images/image2.jpeg')
var image3 = require('../images/image3.jpeg')
var image4 = require('../images/image4.jpeg')
var image5 = require('../images/image5.jpeg')
var logo = require('../images/puzzle_piece.png')
var empty_image = ' '
var drawing = 'https://cdn2.iconfinder.com/data/icons/edit/100/edit-set-10-512.png'

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

aggregate_info = ["the remote is too big", "the remote is white", "too many buttons make it confusing", "this is hall of shame"]


Format = (props) => {
  const possTags = ["#def", "#section", "#important", "#exam", "#what"];
  const means = ["definition", "Section", "Imp", "Exam", "What"]
  const currLine = props.line;
  // if it is a drawing
  if (currLine.indexOf(".png") !== -1) {
    return <Image source={{uri: currLine}} resizeMode="contain" style ={{width:100, height:100}} />
  }
    const toFormat = currLine[0] == '#';
    // if it is not a hashtag, returns the text
    if(!toFormat) {  <Text> {props.line} </Text> }

    const tag = currLine.split(" ", 1)[0];
    const content = currLine.substring(currLine.indexOf(" "));

    // if it is a hashtag, it styles the text
    switch (possTags.indexOf(tag)) {
      case 0: return <Text style={styles.definitionText}> {content}{'\n'}</Text>;
      case 1: return <Text style={styles.sectionText}>{content}{'\n'}</Text>;
      case 2: return <Text style={styles.importantText}> {content}{'\n'}</Text>;
      case 3: return <Text style={styles.examText}> {content}{'\n'}</Text>;
      case 4: 
        // #what case returns a random answer
        var randomAnswer = aggregate_info[Math.floor(Math.random() * aggregate_info.length)];
        return <Text style={styles.whatText}> {randomAnswer}{'\n'}</Text>;

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
    this._loadStoredPressedDrawState();
    this._loadDrawing();
  }

  _loadDrawing = async () => {
    try {
      var storedDrawing = await AsyncStorage.getItem("drawing");
      if (storedDrawing != null && storedDrawing != undefined) {
        this.setState({drawing: storedDrawing})
        index = this.state.pressed_draw;
        // this only adds the drawing to the notes if it has not already been added
        // this prevents the error of reading the same drawing again and again upon app restart
        if (this.state[index] == undefined || this.state[index] == null) {
          this.setState({[index]: storedDrawing});
          this.saveNotes(index);
          return;
        }
        if (this.state[index].indexOf(storedDrawing) == -1) {
          result_text = this.state[index] + '\n' + storedDrawing;
          this.setState({[index]: result_text});
          this.saveNotes(index);
        }
      }
    } catch (error) {
      console.log('Error fetching stored drawings from AsyncStorage')
    }
  }

  _loadStoredPressedDrawState = async () => {
    try {
      var index = await AsyncStorage.getItem("pressed_draw");
      if (index != null && index != undefined) {
        this.setState({pressed_draw: Number(index)});
      }
    } catch (error) {
      console.log('Error fetching stored drawings from AsyncStorage')
    }
  }

  constructor(props) {
    super(props);
    for (var i = 0; i < number_slides; i++) {
        this.state = {[i]: ' '};
    }
    this._loadStoredText();
    this.viewFormat = true;
  }


  // this is called anytime the notes screen is navigated to
  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      this._loadStoredText();
    }
  }

  NotesView = (isOn) => {
  return <Text>{this.state.eventSwitchRegressionIsOn ? 'On' : 'Off'}</Text>

  }



  render() {

    const { navigate } = this.props.navigation;
    var slide_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = Cards[i]
      var textView = null;
      if(this.state.eventSwitchIsOn) {
        textView = <View>   
        <TextInput
            style={styles.noteInput}
            ref={i}
            multiline={true}
            autogrow={true}
            placeholder="Start taking notes..."
            onChangeText={ (text) => {
              this.setState({[i]: text}) }}
            value={this.state[i]}
            onEndEditing={(e)=>{this.saveNotes(i)}}
          />
          <Button key={i+"draw"}
            title="Add drawing"
            onPress={() => {
              this.savePressedDrawState(i);
              this.setState({pressed_draw: i});
              navigate('Draw');
            }
            }
          />
          <Button key={i+"compare"}
            title="Compare notes"
            onPress={() => {
              navigate('Compare');
            }
            }
          />
          </View>
        } else {
          textView =  <ViewNotes key={i} text = {this.state[i]} toFormat = {this.viewFormat}/>
        }
      slide_notes.push(
        <View key={i} style={styles.card}>
          <View key={i+"slide_title"} style={styles[i%4]}>
            <Text style={styles.text_format}> {x.slide_title} </Text>
          </View>
          <Switch
            onValueChange={(value) => this.setState({eventSwitchIsOn: value})}
            style={{marginBottom: 10}}
            value={this.state.eventSwitchIsOn} />
            <Text>{this.state.eventSwitchIsOn ? 'Formatted Off' : 'Formatted On'}</Text>
          {textView}
            <Lightbox backgroundColor='white' underlayColor='white' style={{position: 'absolute', width:100, height:100, top:10, right:0}} activeProps={
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


        </View>
        )
    }
    return (
      <View style={styles.container}>
        <View style={styles.padding_header}></View>
        <View style={styles.header}>
          <FontAwesome name="angle-right" size={45} color={Colors.noticeText} style={styles.leftSwipe}/>
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

  saveNotes = async (i) => {
    try {
      await AsyncStorage.setItem(i.toString(), this.state[i]);
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage');
    }
  };

  savePressedDrawState = async (i) => {
    try {
      await AsyncStorage.setItem("pressed_draw", i.toString());
    } catch (error) {
      console.log('Unable to save pressed_draw to AsyncStorage')
    }
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
    color: 'rgb(242, 74, 65)',
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
  whatText: {
    fontWeight: 'bold',
    color: 'green',
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
  text_format: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  navBar: {
    flex: 1,
    paddingTop: 30,
    height: 64,
    backgroundColor: '#eae8e8',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth:.5,
    borderColor:'#b2bab7',
    backgroundColor: '#eae8e8',
  },
  leftSwipe: {
    position: 'absolute',
    left: 15,
    top: 7,
  },
  padding_header: {
    height: 20,
    flexDirection: 'column',
    backgroundColor: '#eae8e8',
  },
  0: {
    backgroundColor: 'rgb(242, 74, 65)',
    width: 350,
    height: 30,
    alignSelf:'center',
  },
  1: {
    backgroundColor: 'rgb(244, 153, 17)',
    width: 350,
    height: 30,
    alignSelf:'center',
  },
  2: {
    backgroundColor: 'rgb(15, 193, 39)',
    width: 350,
    height: 30,
    alignSelf:'center',
  },
  3: {
    backgroundColor: 'rgb(84, 94, 247)',
    width: 350,
    height: 30,
    alignSelf:'center',
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
