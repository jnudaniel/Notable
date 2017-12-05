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
import SwipeCards from 'react-native-swipe-cards';
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import Lightbox from 'react-native-lightbox'; // 0.6.0
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
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
     );};

  render() {
    var slide_notes = [];
    let i = 0;
      var image  = drawing;
      var x = Cards[i]
      var value = 'drawings' + i
      var drawing = this.state[value]
      var textView = null;
      if(this.state.eventSwitchIsOn) {
        textView = <TextInput
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
        } else {
          textView =  <ViewNotes key={i} text = {this.state[i]} toFormat = {this.viewFormat}/>
        }
      slide_notes.push(
        <View key={i} style={{flex: 1, flexDirection: 'column'}}>
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

        <Switch
        onValueChange={(value) => this.setState({eventSwitchIsOn: value})}
        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
        value={this.state.eventSwitchIsOn} />
        <Text style={{fontSize: 20,padding: 10, color: 'black'}}>{this.state.eventSwitchIsOn ? 'Formatting Off' : 'Formatting On '}</Text>

        </View>
        <View key={i} style={{flex: 1, flexDirection: 'row'}}>

              <View key={i} style={styles.note}>
                    {textView}
             </View>



             <View style ={styles.slide}>


             <Swiper style={styles.wrapper}  onIndexChanged={onSwipe = (index) => {
                console.log('index changed', index);}} showsButtons={true}  >

               <View style={styles.slide1}>
               <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{Cards[0].slide_title} </Text> } source={image1}/>
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

      </View>

      </View>


        )

    // console.log("render was called in notes screen!")
    return (
      <View style={styles.container}>
        <View style={styles.padding_header}></View>
        <View style={styles.header}>
          <FontAwesome name="angle-right" size={45} color={Colors.noticeText} style={styles.leftSwipe}/>
          <Text style={styles.navBar}>N  <FontAwesome name="puzzle-piece" size={40} style={{ color: '#4682B4' }} /> T  A  B  L  E </Text>
        </View>
        <View style={{backgroundColor: '#FCFCFC'}}>
        <Text style={styles.class_name}> {class_name} </Text>
        <Text style={styles.notes_name}> {notes_name} </Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
          {slide_notes}
        </ScrollView>

      </View>

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
};

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
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContentContainer: {
    paddingTop: 0,
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
    paddingTop: 0,
  },
  notes_name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    padding: 0,
  },
  slide_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
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
    height: 50,
    paddingTop: 10,
    backgroundColor: '#FCFCFC',
    textAlign: 'center',
    justifyContent:'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
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

  slideHeader: {
    backgroundColor: 'skyblue',
    width: 328,
    height: 45,
    alignSelf:'center',
  },
   note: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    width:  350,
    height: 420,
  },
    wrapper: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'

  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    width:  350,
    height: 420,
  },
  buttonTags:{
    padding: 10,
  }
});


//
// <TouchableHighlight onPress={(e)=>{this.pickImage(e, i)}}>
// <Image source={{ uri: `${drawing}` }} resizeMode="contain" style ={{ position: 'absolute', width:100, height:100, top:200, left: 50}} />
// </TouchableHighlight>
