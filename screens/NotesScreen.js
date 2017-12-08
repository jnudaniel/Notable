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
import { Button, Icon } from 'react-native-elements'
import { WebBrowser, Font, ImagePicker } from 'expo';
import { Ionicons, FontAwesome} from '@expo/vector-icons';
import Nav from './global-widgets/nav'
import Iconz from 'react-native-vector-icons/Ionicons';
import { MonoText } from '../components/StyledText';
import Lightbox from 'react-native-lightbox'; // 0.6.0
import Swiper from 'react-native-swiper';
import Colors from '../constants/Colors';
import Carousel, { Pagination } from 'react-native-snap-carousel';

// Theme colors! (if you change these, you need to change them in all the screens)
var darkest_blue = '#0C0F2A';
var medium_blue = '#667797';
var light_blue = '#C9DCED';
var yellow = '#FAF57E';
var white = '#FFFFFF';

//import Icon from 'react-native-vector-icons/MaterialIcons';
//import SwipeCards from 'react-native-swipe-cards';
//import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

var cs_slide1 = require('../images/cs_slide1.jpg')
var cs_slide2 = require('../images/cs_slide2.jpg')
var cs_slide3 = require('../images/cs_slide3.jpg')
var math_slide1 = require('../images/math_slide1.jpg')
var math_slide2 = require('../images/math_slide2.gif')
var math_slide3 = require('../images/math_slide3.png')
var bio_slide1 = require('../images/bio_slide1.jpg')
var bio_slide2 = require('../images/bio_slide2.jpg')
var bio_slide3 = require('../images/bio_slide3.png')
var number_slides = 3

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

dimensionRounded = (percentage, dimension) => {
  let rounded = 0;
  if (dimension == "width") {
    rounded = (percentage * viewportWidth) / 100;
  }
  else {
    rounded = (percentage * viewportHeight) / 100;
  }
  return Math.round(rounded);
}

const slideHeight = viewportHeight * 0.7;
const slideWidth = dimensionRounded(84, "width");
const itemHorizontalMargin = dimensionRounded(2, "width");
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

const CS_Cards = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "image": cs_slide1
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "image": cs_slide2
}, {
  "id": 3,
  "slide_title": "Ideate",
  "image": cs_slide3
}]

const Math_Cards = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "image": math_slide1
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "image": math_slide2
}, {
  "id": 3,
  "slide_title": "Ideate",
  "image": math_slide3
}]

const Bio_Cards = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "image": bio_slide1
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "image": bio_slide2
}, {
  "id": 3,
  "slide_title": "Ideate",
  "image": bio_slide3
}]

cards = Math_Cards;
aggregate_info = ["the remote is too big", "the remote is white", "too many buttons make it confusing", "this is hall of shame"]

Format = (props) => {
    const possTags = ["#def", "#section", "#important", "#exam", "#what"];
    const means = ["definition", "Section", "Imp", "Exam", "What"]
    const currLine = props.line;
    const toFormat = currLine[0] == '#';
    // if it is not a hashtag, returns the text
    if(!toFormat) {  <Text>{props.line}</Text> }
    // if it is a drawing
    if (currLine.indexOf(".png") !== -1) {
      return (<Lightbox backgroundColor='white' underlayColor='white' style={{position: 'absolute', width:100, height:100, top:10, right:0}} activeProps={
                    {
                        style: {
                            width: 350,
                            height: 500,
                        },
                        resizeMode: 'contain'
                    }
                }>
          <Image source={{uri: currLine}} resizeMode="contain" style ={{width:100, height:100}} />
       </Lightbox>)
    }
      const tag = currLine.split(" ", 1)[0];
      const content = currLine.substring(currLine.indexOf(" "));

      // if it is a hashtag, it styles the text
      switch (possTags.indexOf(tag)) {
        case 0: return <Text style={styles.definitionText}>{content}{'\n'}</Text>;
        case 1: return <Text style={styles.sectionText}>{content}{'\n'}</Text>;
        case 2: return <Text style={styles.importantText}>{content}{'\n'}</Text>;
        case 3: return <Text style={styles.examText}>{content}{'\n'}</Text>;
        case 4:
          // #what case returns a random answer
          var randomAnswer = aggregate_info[num_what];
          num_what = num_what + 1;
          if (num_what == aggregate_info.length) {
            num_what = 0;
          }
          return <Text style={styles.whatText}> {randomAnswer}{'\n'}</Text>;
    }
    return <Text style={styles.unformattedText}>{props.line}{'\n'}</Text>;
  }

  key_val = 0
  num_what = 0
  ViewNotes = (props) => {
    key_val = 0
    num_what = 0
    const lines = String(props.text).split('\n');
    key_val = key_val + 1
    const listItems = lines.map((line) =>
      <Format key={line + Math.random()} line = {line}> </Format>
    );
    return (
      <Text key={key_val}>{listItems}</Text>
    );
  }

export default class NotesScreen extends React.Component {

  // makes header flush with top of screen
  static navigationOptions = {
    header: null,
  };

    async componentDidMount() {
     await Font.loadAsync({
       'avenir': require('../fonts/avenir-next-regular.ttf'),
     });

     this.setState({ fontLoaded: true });
   }

  
  _loadStoredText = async () => {
    console.log("In load stored text.");
    try {
      for (let i = 0; i < number_slides; i++) {
        var value = i.toString();
        var storedText = await AsyncStorage.getItem(value);
        if (storedText != null && storedText != undefined) {
          this.setState({[i]: storedText});
        } else {
          this.setState({[i]: ""});
        }
      }
    } catch (error) {
      console.log('Error fetching stored notes from AsyncStorage')
    }
    console.log("Done with load stored text");
  }

  _loadSlideDeck = async () => {
    console.log("In load slide deck");
    try {
      var deck_num = await AsyncStorage.getItem("slide_deck");
      if (deck_num != null && deck_num != undefined) {
        this.setState({slide_deck: Number(deck_num)});
      } else {
        this.setState({slide_deck: 1});
      }
    } catch (error) {
      console.log('Error fetching slide deck number from AsyncStorage')
    }
    console.log("Done with loading the slide deck.");
  }

  _loadDrawing = async () => {
    console.log("In load drawing.");
    try {
      await this._loadStoredText();
      await this._loadCurrentSlideState();
      await this._loadSlideDeck();
      var storedDrawing = await AsyncStorage.getItem("drawing");
      if (storedDrawing != null && storedDrawing != undefined) {
        this.setState({drawing: storedDrawing})
        index = this.state.current_slide;
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

  _loadCurrentSlideState = async () => {
    console.log("In load current slide state.");
    try {
      var index = await AsyncStorage.getItem("current_slide");
      if (index != null && index != undefined) {
        this.setState({current_slide: Number(index)});
      } else {
        this.setState({current_slide: 0});
        index = 1;
      }
      console.log(index);
      switch(index) {
        case 1:
          cards = CS_Cards;
          this.state.class_name = "CS109";
          this.state.lecture_name = "Lecture 5: Naive Bayes";
          return;
        case 2:
          cards = Math_Cards;
          this.state.class_name = "Math51";
          this.state.lecture_name = "Lecture 7: Null Space";
          return;
        case 3:
          cards = Bio_Cards;
          this.state.class_name = "Biology";
          this.state.lecture_name = "Lecture 10: Meiosis";
          return;
      }
    } catch (error) {
      console.log('Error fetching stored drawings from AsyncStorage')
    }
    console.log("Done with load current slide state.");
    console.log(cards);
  }

  // don't call setState from constructor; just initialize state to what it should be
  constructor(props) {
    super(props);
    // this.state = {};
    this.state = {in_compare: false};
    // for (var i = 0; i < number_slides; i++) {
    //     this.state = {[i]: ''};

    //   // this.state['drawings' + i] = drawing;
    // }
    this._loadDrawing();
    // this.viewFormat = true;
    // this is called anytime the notes screen is navigated to
    console.log('done in notes constructor. state is', this.state)
    this._renderItem = this._renderItem.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      console.log("Just reloaded notes screen.");
      this._loadDrawing();
    }
  }

// this toggles every time the user clicks the toggle notes button between compare notes and view notes
  _handleToggleNotesButton = () => {
    console.log("In handle toggle notes");
    console.log(this.state.in_compare);
    curr_status = this.state.in_compare;
    this.setState({in_compare: !curr_status});
  }

  saveNotes = async (i) => {
    console.log('attempting to save notes');
    console.log("Index is ", i);
    try {
      await AsyncStorage.setItem(i.toString(), this.state[i]);
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage');
    }
  };

  // this keeps track of which slide the user clicked draw on
  saveCurrentSlideState = async (i) => {
    try {
      await AsyncStorage.setItem("current_slide", i.toString());
    } catch (error) {
      console.log('Unable to save current_slide to AsyncStorage')
    }
    console.log('succesful at saving notes')
  }

  renderHeader = () => {
    return(
      <View style={styles.header_container}>
        <View style={styles.paddingAboveHeader}></View>
        <View style={styles.headerContent}>
          <View style={styles.leftMenuSwipe}>
            <Text>
              <FontAwesome name="angle-double-right" size={45} style={{color: medium_blue}}/>
            </Text>
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.class_name}>
              {this.state.class_name}  <FontAwesome name="angle-right" size={20} style={{fontWeight: 'bold', color: medium_blue, marginLeft: 5, marginRight: 5}}/>  {this.state.lecture_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={this._handleToggleNotesButton}
            style={this.toggleNotesStyleButton()}>
            <Text style={this.toggleNotesStyleText()}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._handleToggleNotesButton}
            style={this.toggleCompareStyleButton()}>
            <Text style={this.toggleCompareStyleText()}>Take Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  toggleNotesStyleButton = () => {
    if(this.state.in_compare) {
      return styles.toggleButtonOff;
    } else {
      return styles.toggleButtonOn;
    }
  }

  toggleCompareStyleButton = () => {
    if(this.state.in_compare) {
      return styles.toggleButtonOn;
    } else {
      return styles.toggleButtonOff;
    }
  }

  toggleNotesStyleText = () => {
    if(this.state.in_compare) {
      return styles.toggleLabelOff;
    } else {
      return styles.toggleLabelOn;
    }
  }

  toggleCompareStyleText = () => {
    if(this.state.in_compare) {
      return styles.toggleLabelOn;
    } else {
      return styles.toggleLabelOff;
    }
  }

  renderButtons = () => {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.buttonsBar}>
        <Button
         title="#Section"
         onPress={this._addSectionToInput}
         backgroundColor = '#00BFFF'
         icon={{name: 'note-add'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="#Definition"
         onPress={this._addDefinitionToInput}
         backgroundColor = '#7B68EE'
         icon={{name: 'book'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="#Important"
         onPress={this._addImportantToInput}
         backgroundColor = '#3CB371'
         icon={{name: 'new-releases'}}
         buttonStyle={styles.buttonTags}
        />
      
         <Button
         title="#Exam"
         onPress={this._addExamToInput}
         backgroundColor = '#3CB371'
         icon={{name: 'new-releases'}}
         buttonStyle={styles.buttonTags}
        />

        <Button
         title="Draw"
         backgroundColor = '#FF6347'
         icon={{name: 'edit'}}
         buttonStyle={styles.buttonTags}
         onPress={() => {
          this.saveCurrentSlideState(this.state.current_slide);
          this.setState({current_slide: this.state.current_slide});
          navigate('Draw');
          }
          }
        />
        <Button key={"compare"}
            title="Compare notes"
            onPress={() => {
              navigate('Compare');
            }
            }
          />
      </View>
    )
  }

  // this returns all of the rendered slides
  renderSwiper = () => {
    return (
      <View style={styles.slideContainer}>
        <Swiper
          // onIndexChanged={onSwipe = (index) => {
          //   console.log('index changed', this.state.current_slide);
          // }}
          showsButtons={true}>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={
              <Text style ={styles.slide_title} numberOfLines={1}>
                {cards[0].slide_title}
              </Text>
            }
            source={image1}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {cards[0].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{cards[1].slide_title} </Text> } source={image2}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {cards[1].slide_title} </Text>
          </View>
          <View style={styles.slide1}>
            <Image style={{resizeMode: 'contain'}} title={<Text style ={styles.slide_title} numberOfLines={1}>{cards[2].slide_title} </Text> } source={image3}/>
            <Text style ={styles.slide_title}  numberOfLines={1}>  {cards[2].slide_title} </Text>
          </View>
        </Swiper>
      </View>
    )
  }

  // renders the class slide
  renderImage = (slide) => {
    return (
      <View style={styles.slideContainer_noswipe}>
        <Image source={slide.image} style={{flex:1, resizeMode: 'contain'}}/>
      </View>
    )
  }

  // renders the formatted notes
  renderCompareNoteView = () => {
    return (
      <View key={this.state.current_slide} style={styles.viewnotes_container}>
        <View style={styles.viewclassnotes}>
          <ViewNotes key={this.state.current_slide} current_slide = {this.state.current_slide} text = {this.state[this.state.current_slide]}/>
        </View>
      </View>
    )
  }

  // renders the formatted notes
  renderNoteView = () => {
    return (
      <View key={this.state.current_slide} style={styles.viewnotes_container}>
        <View style={styles.viewnotes}>
          <ViewNotes key={this.state.current_slide} current_slide = {this.state.current_slide} text = {this.state[this.state.current_slide]}/>
        </View>
      </View>
    )
  }

  // renders the tiny input box on the bottom left where the user enters their notes
  renderNoteEdit = () => {
    return (
      <View style={styles.noteInputContainer}>
        <TextInput
          style={styles.noteInput}
          ref={this.state.current_slide}
          multiline={true}
          autogrow={true}
          placeholder="Start taking notes..."
          onChangeText={ (text) => {
            console.log("In render note edit!", this.state.current_slide)
            this.setState({[this.state.current_slide]: text}) }}
          value={this.state[this.state.current_slide]}
          onEndEditing={(e)=>{this.saveNotes(this.state.current_slide)}}
        />
      </View>
    )
  }

  renderCompareView = () => {
    return (
      <TextInput
        style={styles.compareView}
        ref={this.state.current_slide}
        multiline={true}
        autogrow={true}
        placeholder="THIS WILL HAVE THE CLASS NOTES"
      />
    )
  }

  renderLeftPanel = (slide) => {
    if (this.state.in_compare) {
      return (
      <View style={styles.aggregate_notes_panel}>
        {/*this.renderSwiper()*/}
        {this.renderCompareNoteView()}
      </View>
      )
    } else {
      return (
      <View style={styles.left_content_panel}>
        {/*this.renderSwiper()*/}
        {this.renderImage(slide)}
        {this.renderButtons()}
        {this.renderNoteEdit()}
      </View>
      )
    }
  }

  renderRightPanel = () => {
    return (
      <View style={styles.right_content_panel}>
        {this.renderNoteView()}
      </View>
    )
  }

  renderCurrentCard = (slide) => {
    // console.log('rendering current card. slide is', slide)
    return (
      <View style={styles.main_card}>
        <View style={styles.card_header}>
          <Text style={{fontSize: 35, margin: 20,}}>{slide.slide_title}</Text>
        </View>
        <View style={styles.card_contents}>
          {this.renderLeftPanel(slide)}
          {this.renderRightPanel()}
        </View>
      </View>
    )
  }

  _renderItem({item, index}) {
    return (
      <View style={{width: 950, height: '96%'}}>
        {this.renderCurrentCard(item)}
      </View>
    )
  }

  _addDefinitionToInput = () => {

        added_text = this.state[this.state.current_slide] + "\n" + "#def";
        this.setState({[this.state.current_slide]: added_text});
        this.saveNotes(this.state.current_slide);
  }
  _addSectionToInput = () => {

        added_text = this.state[this.state.current_slide] + "\n" + "#section";
        this.setState({[this.state.current_slide]: added_text});
        this.saveNotes(this.state.current_slide);
  }
  _addImportantToInput = () => {

        added_text = this.state[this.state.current_slide] + "\n" + "#important";
        this.setState({[this.state.current_slide]: added_text});
        this.saveNotes(this.state.current_slide);
  }
  
    _addExamToInput = () => {

        added_text = this.state[this.state.current_slide] + "\n" + "#exam";
        this.setState({[this.state.current_slide]: added_text});
        this.saveNotes(this.state.current_slide);
  }



  render() {
    return (
      <View style={styles.app_container}>
        {this.renderHeader()}
        <View style={styles.cards_container}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={cards}
            firstItem = {this.state.current_slide}
            renderItem={this._renderItem}
            itemWidth={950}
            sliderWidth={viewportWidth}
            
            style={styles.carousel}
            onSnapToItem={(index) => this.setState({ current_slide: index }) }
          />
        </View>
      </View>

// HOW TO USE AVENIR FONT

  //   this.state.fontLoaded ? (
  //     <Text style={{ fontFamily: 'avenir', fontSize: 56 }}>
  //       Hello, world!
  //     </Text>
  //   ) : null
  // }


    );
  }
}
/*slideStyle={{ height: '95%', borderStyle: 'solid', borderColor: 'blue' }} 

    <View style={styles.side_card_left}></View>
    {this.renderCurrentCard()}
    <View style={styles.side_card_right}></View>



          this.renderButtons()
          <View style={styles.left_content_panel}>
            {this.renderNoteView(index)}
            {this.renderSwiper()}
          </View>
          <View style={styles.right_content_panel}>
            {this.renderNoteEdit(index)}
            {this.renderCompareView(index)}
          </View> */

// !!!!!! PLEASE PUT STYLES IN APPROPRIATE SECTION :) !!!!!!
const styles = StyleSheet.create({
  // --------- MAJOR AREAS ---------
  app_container: {
    flex: 1,
    backgroundColor: '#C9DCED', // light blue
  },
  cards_container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#C9DCED', // light blue
  },
  carousel: {
    alignSelf: 'center',
  },
  side_card_left: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
    backgroundColor: '#ffffff',
    width: 20,
    height: '90%',
    marginTop: 'auto',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  side_card_right: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    backgroundColor: '#ffffff',
    width: 20,
    height: '90%',
    marginTop: 'auto',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  main_card: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    //marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    flexDirection: 'column',
  },
  // --------- HEADER ---------
  header_container: {
    backgroundColor: light_blue, // light blue
  },
  paddingAboveHeader: {
    height: 20,
    backgroundColor: '#eae8e8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center', // centers vertically
    justifyContent: 'flex-start', // aligns left horizontally
    width: '100%',
    //backgroundColor: 'white',
  },
  leftMenuSwipe: {
    alignSelf: 'flex-start',
    //marginRight: 'auto',
    marginLeft: 10,
  },
  headerTitles: {
    //alignSelf: 'flex-start',
    marginLeft: 15,
    marginRight: 'auto',
    paddingTop: 2,
  },
  class_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: medium_blue,
    textAlign: 'center',
    paddingTop: 0,
  },
  toggleButtonOff: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: medium_blue,
    borderColor: medium_blue,
    borderWidth: 3,
    width: 180,
    marginRight: 50,
    paddingVertical: 8,
  },
  toggleButtonOn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: white,
    borderColor: medium_blue,
    borderWidth: 3,
    width: 180,
    marginRight: 50,
    paddingVertical: 8,
  },
  toggleLabelOff: {
    fontWeight: 'bold',
    color: white,
  },
  toggleLabelOn: {
    fontWeight: 'bold',
    color: medium_blue,
  },
  // --------- MAIN CARD CONTENTS ---------
  card_header: {
    alignSelf: 'flex-start',
    marginBottom: 'auto',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card_contents : {
    flex: 12,
    flexDirection: 'row',
  },
  // --------- WHOLE LEFT PANEL ---------
  left_content_panel: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingTop: 30,
  },
  aggregate_notes_panel: {
    flex: 1,
  },
  
  // --------- SLIDE VIEW AREA --------- 
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    //width:  350,
    //height: 420,
  },
  slideContainer_noswipe: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'center',
    width: '85%',
    paddingTop: 10,
    paddingBottom: 50,
    //backgroundColor: 'blue'
    //height: 420,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  /*slide_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },*/
    // --------- BUTTONS BAR ---------
  buttonsBar: {
    marginTop:20,
    flex: .25,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  definitionText: {
    fontSize: 23,
    color: '#667797', // med blue
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  sectionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0C0F2A', // dark blue
    textDecorationLine: 'underline',
  },
  importantText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#0C0F2A', // dark blue
    backgroundColor: '#FAF57E', // bright yellow
  },
  examText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#667797', // med blue
  },
  unformattedText: {
    fontSize: 23,
    color: '#0C0F2A', // dark blue
  },
  whatText: {
    fontWeight: 'bold',
    color: 'green',
  },
  buttonTags: {
    backgroundColor: yellow,
    overflow: 'hidden',
    borderRadius: 10,
    padding: 10
  },
  // --------- NOTE INPUT AREA ---------
  noteInputContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 15,
    marginBottom: 25,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C9DCED', // light blue
    borderRadius: 5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  noteInput: {
    flex: 1,
    width: '95%',
    height: '95%',
    marginTop: 10,
    padding: 10,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'left',
    shadowOpacity: 0,
    backgroundColor: 'transparent',
  },
  compareView: {
    flex: 1,
    margin: 15,
    marginLeft: 45,
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: medium_blue, // med blue
    borderRadius: 15,
  },
  // --------- WHOLE RIGHT PANEL ---------
  right_content_panel: {
    flex: 1,
    //flexDirection: 'column',
  },
  // --------- NOTE VIEW AREA ---------
  viewnotes_container: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'flex-start',
    width:  '100%',
    height: '100%',
    maxWidth: '100%',
  },
  viewnotes: {
    flex: 1,
    width: '93%',
    //height: '92%',
    margin: 25,
    padding: 20,
    backgroundColor: '#FAF8C6', // light yellow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  viewclassnotes: {
    flex: 1,
    width: '93%',
    //height: '92%',
    margin: 25,
    padding: 20,
    backgroundColor: white,
  },
  /*
  // --------- SEEM NO LONGER IN USE ---------
  buttonSmall:{
    width:50,
    height:50,
    borderWidth:10,
    borderColor:'#e7e7e7',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25
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