import React from 'react';
import { Text, View, Alert, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'; // 2.4.0
import Autocomplete from 'react-native-autocomplete-input';

export default class MenuSide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     showModal: false,

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
  }

  setClass(title, content) {
    this.setState({ classes_query: title})
    this.setState({class_done: true});
  }
  

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
    return (  
      <Autocomplete
        autoCapitalize="none"
        autoCorrect={false}
        data={classes.length === 1 && comp(classes_query, classes[0].title) ? [] : classes}
        defaultValue={classes_query}
        onChangeText={text => this.setState({ classes_query: text })}
        placeholder="Enter the class wish to join"
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
    var chosen = this.state.classes_chosen.slice()
    chosen.push(this.state.classes_unchosen[index])
    this.setState({ classes_chosen: chosen })
    this.setState({ classes_unchosen: this.state.classes_unchosen.filter((_, i) => i !== index)});
  }

  render_modal() {
    return (
      <Modal isVisible={this.state.visibleModal} >
        <View style={styles.modalContent}>
          <Text style={styles.text}> Enter your class </Text>
            {this.render_class_autocomplete()}
          <Button
            title="Close"
            onPress={() => this.closeModal()}
            backgroundColor = '#FF6347'
            buttonStyle={styles.buttonTags}
          />
          <Button
            title="Add"
            disabled={!(this.state.class_done)}
            onPress={() => this.addClassToList()}
            backgroundColor = '#FF6347'
            buttonStyle={styles.buttonTags}
          />
        </View>
      </Modal>
      )
  }

  _renderHeader(section) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}
        <Ionicons name="ios-arrow-down" size={20} />
        </Text>
      </View>
    );
  }
  _handleButtonPress = () => {
    
  };

  _renderContent(section) {
    return (
      <View style={styles.content}>
        <Text style={styles.contentItem}>{section.content[0]}</Text>
        <Text style={styles.contentItem}>{section.content[1]}</Text>
      </View>
    );
  }

  render() {
    return (
    	<View >
    		<Text style={styles.menuHeader}>My Classes</Text>
	    	<View style={styles.accordion}>
		      <Accordion
		        sections={this.state.classes_chosen}
		        renderHeader={this._renderHeader}
		        renderContent={this._renderContent}
		        underlayColor='#DBEDFF'
		      />
          {this.render_modal()}
          <Button
            title="New Class"
            onPress={() => this.setState({ visibleModal: true })}
            backgroundColor = '#0C0F2A'
          />
		    </View>
		</View>
    );
  }
}

const styles = StyleSheet.create({
  menuHeader: {
  	fontWeight: 'bold',
  	fontSize: 30,
  	padding: 20,
  	paddingLeft: 15,
    paddingRight: 0,
  	backgroundColor: '#4682B4',
  },
  accordion: {
  	padding: 15,
  	backgroundColor: '#DBEDFF',
  },
  header: {
  	paddingTop: 15,
  	paddingBottom: 15,
  },
  headerText: {
  	fontWeight: 'bold',
  },
  content: {
  },
  contentItem: {
  	paddingTop: 5,
  	paddingBottom: 5,
  },
     modalContent:{
    width:500,
    height:500,
    borderWidth:10,
    borderColor:'#e7e7e7',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#C9DCED',
    borderRadius:40
  }
});
