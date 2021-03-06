import React from 'react';
import { Text, View, Alert, StyleSheet, TextInput, TouchableOpacity, AsyncStorage, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'; // 2.4.0
import Autocomplete from 'react-native-autocomplete-input';
import Nav from '../screens/global-widgets/nav'
import { NotesScreen } from '../screens/NotesScreen.js'
import { AddClass } from '../screens/AddClass.js'

import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';


// Theme colors! (if you change these, you need to change them in all the screens)
var darkest_blue = '#0C0F2A';
var medium_blue = '#667797';
var light_blue = '#C9DCED';
var yellow = '#FAF57E';
var white = '#FFFFFF';

export default class MenuSide extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     showModal: false,
     email: 'yourEmail@website.com',
     classes_chosen : [],
     classes_unchosen :[
      {
        title: 'CS 107',
        content: ['Lecture 1: Syllabus', 'Lecture 2: Binary Bomb', 'Lecture 3: Heap Allocator'],
        slide_index: 1,
      },
       {
        title: 'CS 109  ',
        content: ['Lecture 1: Counting', 'Lecture 2: Combinatorics', 'Lecture 3: Sampling'],
        slide_index: 1,
      },
      {
        title: 'CS 110',
        content: ['Lecture 1: Overview', 'Lecture 2: Systems', 'Lecture 3: Threading'],
        slide_index: 1,
      },
      {
        title: 'CS 147  ',
        content: ['Lecture 1: Design', 'Lecture 2: User Interviews', 'Lecture 3: Exam Review'],
        slide_index: 1,
      },
      {
        title: 'HUMBIO 155H  ',
        content: ['Lecture 1: Polyomavirus', 'Lecture 2: Zika Virus', 'Lecture 3: Innoculation'],
        slide_index: 2,
      },
      {
        title: 'MATH 101',
        content: ['Lecture 1: Choosing a topic', 'Lecture 2: Direction', 'Lecture 3: Presentation Skills'],
        slide_index: 3,
      },
      {
        title: 'MATH 120',
        content: ['Lecture 1: Groups', 'Lecture 2: Rings', 'Lecture 3: Coordinates'],
        slide_index: 3,
      },
    ],
    classes_query: '',
    class_done:false,
   }
   this._renderContent = this._renderContent.bind(this)
   // this.getEmail()
  }

  // getEmail = async () => {

  //   var storedText = await AsyncStorage.getItem("email");
  //   if(storedText == undefined || storedText == null) storedText = "No Email Entered"
  //   this.setState({email: storedText});
  // }

  // chooseLecture(slide_index) {
  //   console.log(slide_index);
  // }

  componentWillReceiveProps(newProps) {
    console.log("IN MENU");
    console.log(newProps);
  }

  chooseLecture = async (slide_index) => {
    // const { navigate } = this.props.navigation;
    console.log("Saving slide deck number:")
    console.log(this)
    console.log(slide_index);
    try {
      await AsyncStorage.setItem("slide_deck", slide_index.toString());
    } catch (error) {
      console.log('Unable to save slide_deck to AsyncStorage')
      return;
    }
    NotesScreen.forceUpdateHandler().catch(function(error) {
      console.log(error.message);
    });
    navigate("Notes");
  };

  setClass(title, content) {
    this.setState({ classes_query: title})
    this.setState({class_done: true});
  }

  // chooseLecture(slide_index) {
  //   console.log(slide_index);
  // }


  findClass(query) {
    if (query === '') {
      return this.state.classes_unchosen;
    }

    const { classes_unchosen } = this.state;
    var regexp_str = '(^' + query + '| ' + query + ')';
    const regex = new RegExp(regexp_str, 'i');
    return classes_unchosen.filter(_class => _class.title.search(regex) >= 0);
  }

  render_class_autocomplete() {
    const { classes_query } = this.state;
    const classes = this.findClass(classes_query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    // look up autocomplete API, but if not wonderful it's fine
    return (
      <Autocomplete
        autoCapitalize="none"
        autoCorrect={false}
        data={classes.length === 1 && comp(classes_query, classes[0].title) ? [] : classes}
        defaultValue={classes_query}
        onChangeText={text => this.setState({ classes_query: text })}
        placeholder="Enter your class name   "
        renderItem={({title, content}) => (
           <TouchableOpacity onPress={() => this.setClass(title, content)}>
            <Text >
              {title}
            </Text>
          </TouchableOpacity>
        )}
      />
    )
  }

  closeModal() {
    this.setState({visibleModal: false});
    this.setState({classes_query: ''});
    this.setState({class_done: false});
  }

  addClassToList() {
    this.setState({visibleModal: false});
    this.setState({classes_query: ''});
    this.setState({class_done: false});
    var index = this.state.classes_unchosen.map(function(e) { return e.title; }).indexOf(this.state.classes_query);
    if (index < 0) {
      this.setState({class_done: false})
    } else {
    var chosen = this.state.classes_chosen.slice()
    chosen.push(this.state.classes_unchosen[index])
    this.setState({ classes_chosen: chosen })
    this.setState({ classes_unchosen: this.state.classes_unchosen.filter((_, i) => i !== index)});
    }
  }

  render_modal() {
    return (
      <Modal isVisible={this.state.visibleModal} >
        <View style={styles.modalContent}>
           <Button
            title="X"
            borderWidth={10}
            borderColor='medium_blue'
            onPress={() => this.closeModal()}
            buttonStyle={styles.buttonTags1}
          />
          <Text style={styles.text}> Enter your class </Text>
            {this.render_class_autocomplete()}

          <Button
            title="Add"
            disabled={!(this.state.class_done)}
            onPress={() => this.addClassToList()}
            backgroundColor = '#667797'
            buttonStyle={styles.buttonTags2}
          />
        </View>
      </Modal>
      )
  }

  _renderHeader(section) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{"" + section.title + "  "}
        <Ionicons name="ios-arrow-down" size={20} />
        </Text>
      </View>
    );
  }

  _renderContent(section) {
    return (
      <View style={styles.content}>
        <Button
          title={section.content[0]}
          onPress={() => this.chooseLecture(section.slide_index)}
          backgroundColor={'#FAF8C6'}
          color={darkest_blue}
        />

        <Button
            title={section.content[1]}
            onPress={() => this.chooseLecture(section.slide_index)}
            backgroundColor={'#FAF8C6'}
            color={darkest_blue}
        />

        <Button
            title={section.content[2]}
            onPress={() => this.chooseLecture(section.slide_index)}
            backgroundColor={'#FAF8C6'}
            color={darkest_blue}
        />

      </View>
    );
  }
//style={{flex:1, resizeMode: 'contain'}}
  render() {
    return (
    	<View >
        <View style={styles.paddingAboveHeader}></View>
        <View style={styles.sideMenuContents}>
          <View style={styles.logoContainer}>
            <Image source={require('../images/logo-notable-small.png')} />
          </View>
          <View style={styles.sideMenuLowerSection}>
            <View style={styles.buttonContainer}>
              <Button
                title="Join a Class"
                onPress={() => this.setState({ visibleModal: true })}
                backgroundColor={light_blue}
                color={medium_blue}
              />
            </View>
            <View style={styles.accordion}>
              <Accordion
                sections={this.state.classes_chosen}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                underlayColor='#DBEDFF'
              />
              {this.render_modal()}
            </View>
          </View>
        </View>
		  </View>
    );
  }
}


///
const styles = StyleSheet.create({
  paddingAboveHeader: {
    height: 20,
    backgroundColor: '#eae8e8',
  },
  sideMenuContents: {
    flexDirection: 'column',
    backgroundColor: '#FAF8C6', // light yellow
    height: '100%',
  },
  logoContainer: {
    width: '100%',
    flex: 0.15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: light_blue,
    //borderWidth: 3,
    //borderColor: medium_blue,
    //borderStyle: 'none solid solid none',
  },
  sideMenuLowerSection: {
    flexDirection: 'column',
    width: '100%',
    flex: 0.9,
    backgroundColor: '#FAF8C6', // light yellow
    paddingVertical: 15,
    //borderWidth: 3,
    //borderColor: medium_blue,
    //borderStyle: 'none',
    //borderRight: 'solid',
  },
  sideMenuLogout: {
    flexDirection: 'column',
    flex: 0.35,
    alignItems: 'center',
  },
  menuHeaderText: {
  	fontWeight: 'bold',
  	fontSize: 30,
    color: darkest_blue,
  	padding: 20,
  	paddingLeft: 15,
    paddingRight: 0,
  	backgroundColor: medium_blue,
  },
  buttonContainer: {
    borderRadius: 7,
    padding: 0,
    borderWidth: 3,
    borderColor: medium_blue,
    backgroundColor: light_blue,
    width: '80%',
    alignSelf: 'center',
  },
  accordion: {
  	padding: 15,
  	backgroundColor: '#FAF8C6', // light yellow
  },
  header: {
  	paddingTop: 15,
  	paddingBottom: 15,
    alignSelf: 'center',
  },
  headerText: {
  	fontWeight: 'bold',
    fontSize: 20,
    color: darkest_blue,
  },
  content: {
  },
  contentItem: {
  	paddingTop: 5,
  	paddingBottom: 5,
  },
  logoutButton: {
    width: 80,
    height: 30,
    //backgroundColor: 'orange',//'#FAF8C6', // light yellow
    marginTop: 10,
    marginBottom: 30,
    //alignSelf: 'flex-end',
  },
  email: {
    fontSize: 18,
    //alignSelf: 'flex-end',
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  modalContent:{
    width:400,
    borderWidth:10,
    backgroundColor:light_blue,
    borderColor: medium_blue,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:40
  }, 
  buttonTags1: {
    backgroundColor: medium_blue, // for some reason, the button isn't styling color
    overflow: 'hidden',
    borderRadius: 10,
    margin: 4,
    alignSelf: 'flex-end',
  },
  buttonTags2: {
    backgroundColor: medium_blue, // for some reason, the button isn't styling color
    overflow: 'hidden',
    borderRadius: 10,
    margin: 4,
  },
});
