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
var logo = require('../images/puzzle_piece.png')
var constructed = 0

const combined_notes = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "notes": "hall of shame"
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "notes": "used by IDEO"
}, {
  "id": 3,
  "slide_title": "Ideate",
  "notes": "middle step"
}, {
  "id": 4,
  "slide_title": "Test",
  "notes": "user studies"
}, {
  "id": 5,
  "slide_title": "Point of View",
  "notes": "use open-ended questions"
}]

export default class NotableScreen extends Component {
  constructor(props) {
    super(props);
    for (var i = 0; i < number_slides; i++) {
      this.state = {[i]: ' '};
    }
    this._loadStoredText();
    // console.log("done in compare constructor")
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

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      this._loadStoredText()
    }
  }

  render() {
    var personal_notes = [];
    var class_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var x = combined_notes[i]
      class_notes.push(
        <View key={i+"hi"}>
          <View key={i+"sup"} style={styles[i%4]}>
            <Text style={styles.text_format}> {x.slide_title} </Text>
          </View>
          <View key={i+"yo"} style={styles.card}>
            <View style={[styles.box, styles.box1]}>
              <Text style={styles.notes_text}> {this.state[i]} </Text>
            </View>
            <View style={[styles.box, styles.box2]}>
              <Button key={i+"lol"} onPress={() => {
                var curr_notes = this.state[i] + "\n" + combined_notes[i].notes
                this.setState({ [i]: curr_notes }, () => {
                  try {
                    var value = i.toString();
                    AsyncStorage.setItem(value, this.state[i]);
                  } catch (error) {
                    alert('AsyncStorage error: ' + error.message);
                  }
                });}}
                title={combined_notes[i].notes}
                color="#841584"
              />
            </View>
          </View>
        </View>
        )
    }
    // console.log("render was called in compare!")
    return (
      <View style={styles.container}>
        <View style={styles.padding_header}></View>
        <View style={styles.header}>
          <Image style={styles.navBar} source={logo} resizeMode="contain" />  
        </View> 
        <View style={styles.context}>
            <View style={[styles.box, styles.box2]}>
              <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                <View style={styles.title_text}>
                  <Text style={[styles.box, styles.my_notes]}>My Notes</Text>
                  <Text style={[styles.box, styles.my_notes]}>Class Notes</Text>
                </View>
                {class_notes}
              </ScrollView>
            </View>
        </View>
      </View>
    );
  }

  saveNotes = async () => {
    console.log('attempting to save notes in compare');
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
    backgroundColor: '#ffffff',
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
  title_text: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf:'center',
    // borderWidth:2,
    // borderColor:'#b2bab7',
    // borderWidth:1,
    // backgroundColor: '#f2f7f5',
    width: 350,
    height: 30,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf:'center',
    // borderWidth:2,
    // borderColor:'#b2bab7',
    // borderWidth:1,
    backgroundColor: '#f4f7f6',
    width: 350,
    height: 400,
  },
  scrollContentContainer: {
    paddingTop: 30,
  },
  context: {
    flex: 1,
    flexDirection: 'row'
  },
  box: {
    flex: 1,
  },
  box1: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    borderWidth:.5,
    borderColor:'#b2bab7',
    // backgroundColor: '#f4f7f6',
  },
  //content
  box2: {
    flex: 1,
    borderWidth:.5,
    borderColor:'#b2bab7',
    backgroundColor: '#f4f7f6',
    // backgroundColor: '#eff2f1',
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
  text_format: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  my_notes: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  notes_text: {
    flexWrap:'wrap',
    flex: 1,
  }
});