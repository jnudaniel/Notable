import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions,
  AsyncStorage,
  Switch,
} from 'react-native';
import { Button,Icon } from 'react-native-elements'
import { WebBrowser, ImagePicker } from 'expo';
import { Ionicons, FontAwesome} from '@expo/vector-icons';
import Nav from './global-widgets/nav'
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import Colors from '../constants/Colors';

//import Icon from 'react-native-vector-icons/MaterialIcons';
//import SwipeCards from 'react-native-swipe-cards';
//import Lightbox from 'react-native-lightbox'; // 0.6.0
//import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

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

ViewNotes = (props) => {
  key_val = 0
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
  // makes header flush with top of screen
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

  // don't call setState from constructor; just initialize state to what it should be
  constructor(props) {
    super(props);
    this.state = {};

    for (var i = 0; i < number_slides; i++) {
      this.state['drawings' + i] = drawing;
    }
    this._loadStoredText();
    this._loadStoredDrawings();
    // this.saveNotes = this.saveNotes.bind(this);
    this.viewFormat = true;
    console.log('done in notes constructor. state is', this.state)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      this._loadStoredText()
    }
  }

  NotesView = (isOn) => {
    return <Text>{this.state.eventSwitchRegressionIsOn ? 'On' : 'Off'}</Text>
  }

  _handleButtonPress = () => {
    Alert.alert(
       'Button pressed!',
       'You did it!',
     );
  }

  pickImage = async (e, i) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);
    if (!result.cancelled) {
      this.setState({['drawings' + i]: result.uri});
    }
  }

  onSwipe = (index) => {
    console.log('index changed', index);
    // this.setState({[index]: text}) }}
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
  }

  renderHeader = () => {
    return(
      <View style={styles.header_container}>
        <View style={styles.paddingAboveHeader}>
        </View>
        <Text><FontAwesome name="angle-right" size={45} style={styles.leftMenuSwipe}/></Text>
        <View style={styles.header}>
          <Text style={styles.app_name_title}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#4682B4' }} /> T  A  B  L  E </Text>
        </View>
        <View style={{backgroundColor: '#FCFCFC'}}>
          <Text style={styles.class_name}> {class_name} </Text>
          <Text style={styles.notes_name}> {notes_name} </Text>
        </View>
      </View>
    )
  }

  renderButtons = () => {
    return (
      <View style ={{marginTop:20, flex: .2, flexDirection: 'row', justifyContent: 'center'}}>
        <Button
         title="#Section"
         onPress={this._handleButtonPress}
         backgroundColor = '#00BFFF'
         icon={{name: 'note-add'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="#Definition"
         onPress={this._handleButtonPress}
         backgroundColor = '#7B68EE'
         icon={{name: 'book'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="#Important"
         onPress={this._handleButtonPress}
         backgroundColor = '#3CB371'
         icon={{name: 'new-releases'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="Draw"
         onPress={this._handleButtonPress}
         backgroundColor = '#FF6347'
         icon={{name: 'edit'}}
         buttonStyle={styles.buttonTags}
        />
      </View>
    )
  }

  renderSwiper = () => {
    return (
      <View style={styles.slideContainer}>
        <Swiper
          onIndexChanged={onSwipe = (index) => {
            console.log('index changed', index);
          }}
          showsButtons={true}>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={
              <Text style ={styles.slide_title} numberOfLines={1}>
                {Cards[0].slide_title}
              </Text>
            }
            source={image1}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {Cards[0].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{Cards[1].slide_title} </Text> } source={image2}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {Cards[1].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{Cards[2].slide_title} </Text> } source={image3}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {Cards[2].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{Cards[3].slide_title} </Text> } source={image4}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {Cards[3].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{Cards[4].slide_title} </Text> } source={image5}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {Cards[4].slide_title} </Text>
          </View>
        </Swiper>
      </View>
    )
  }

  renderNoteView = (index) => {
    return (
      <View key={index} style={styles.viewnotes_container}>
        <View style={styles.viewnotes}>
          <ViewNotes key={index} text = {this.state[index]} toFormat = {this.viewFormat}/>
        </View>
      </View>
    )
  }

  renderNoteEdit = (index) => {
    return (
      <TextInput
        style={styles.noteInput}
        ref={index}
        multiline={true}
        autogrow={true}
        placeholder="Start taking notes..."
        onChangeText={ (text) => {
          this.setState({[index]: text}) }}
        value={this.state[index]}
        onEndEditing={(e)=>{this.saveNotes(e, index)}}
      />
    )
  }

  renderCompareView = (index) => {
    return (
      <TextInput
        style={styles.compareView}
        ref={index}
        multiline={true}
        autogrow={true}
        placeholder="THIS WILL HAVE THE CLASS NOTES"
      />
    )
  }

  render() {
    let index = 0;
    var image  = drawing;
    var x = Cards[index]
    var value = 'drawings' + index
    var drawing = this.state[value]
    var textView = null;

    // console.log("render was called in notes screen!")
    return (
      <View style={styles.app_container}>
        {this.renderHeader()}
        {this.renderButtons()}
        <View style={styles.top_content_panel}>
          {this.renderNoteView(index)}
          {this.renderSwiper()}
        </View>
        <View style={styles.bottom_content_panel}>
          {this.renderNoteEdit(index)}
          {this.renderCompareView(index)}
        </View>

        {/*/<ScrollView style={styles.scroll_container} contentContainerStyle={styles.scrollContentContainer}>*/}
          {/*<View key={i} style={{flex: 1, flexDirection: 'column'}}>*/}
            {/*<View key={i} style={styles.row_content_container}>
              {this.renderLeftPanel(i)}
              {this.renderSwiper()}*/}
            {/*</View>
          </View>
        </ScrollView>*/}
      </View>
    );
  }
}

// !!!!!! PLEASE PUT STYLES IN APPROPRIATE SECTION :) !!!!!!
const styles = StyleSheet.create({
  // --------- MAJOR AREAS ---------
  app_container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll_container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContentContainer: {
    paddingTop: 0,
  },
  // --------- HEADER ---------
  header_container: {
    backgroundColor: '#C9DCED', // light blue
  },
  paddingAboveHeader: {
    height: 20,
    flexDirection: 'column',
    backgroundColor: '#eae8e8',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
  },
  leftMenuSwipe: {
    position: 'absolute',
    left: 45,
    top: 7,
    color: '#0C0F2A', // dark blue
  },
  app_name_title: {
    flex: 1,
    height: 50,
    paddingTop: 10,
    backgroundColor: '#FCFCFC',
    textAlign: 'center',
    justifyContent:'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  class_name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    paddingTop: 0,
  },
  notes_name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    padding: 0,
  },
  // --------- BUTTONS BAR ---------
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
  buttonTags:{
    padding: 10,
  },
  // --------- WHOLE TOP PANEL ---------
  top_content_panel: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: '#FAF57E', // yellow
    height: '100%',
  },
  // --------- NOTE VIEW AREA ---------
  viewnotes_container: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf:'flex-start',
    width:  '50%',
    height: 420,
    //backgroundColor: '#C9DCED', // light blue
  },
  viewnotes: {
    flex: 1,
    width: '92%',
    //height: 
    margin: 15,
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#667797', // med blue
    borderRadius: 15,
  },
  // --------- SLIDE VIEW AREA --------- 
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    width:  350,
    //height: 420,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  slide_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  // --------- WHOLE BOTTOM PANEL ---------
  bottom_content_panel: {
    flex: 0.7,
    flexDirection: 'row',
  },
  // --------- NOTE INPUT AREA ---------
  noteInputContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  noteInput: {
    width: '46%',//350,
    margin: 15,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'left',
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#667797', // med blue
    borderRadius: 15,
  },
  compareView: {
    flex: 1,
    margin: 15,
    marginLeft: 45,
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#667797', // med blue
    borderRadius: 15,
  },
  /*
  // --------- SEEM NO LONGER IN USE ---------
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text_format: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  navigationFilename: {
    marginTop: 5,
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
  },*/
})
