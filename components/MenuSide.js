import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';


const SECTIONS = [
  {
    title: 'CS 147  ',
    content: ['Lecture 1: Design', 'Lecture 2: User Interviews', 'Lecture 3: Exam Review'],
  },
  {
    title: 'HUMBIO 155H  ',
    content: ['Lecture 1: Polyomavirus', 'Lecture 2: Zika Virus', 'Lecture 3: Innoculation'],
  },
  {
    title: 'CS 109  ',
    content: ['Lecture 1: Counting', 'Lecture 2: Combinatorics', 'Lecture 3: Sampling'],
  },
  {
    title: 'INTNLREL 140A  ',
    content: ['Lecture 1: America', 'Lecture 2: Russia', 'Lecture 3: Proxy Wars'],
  },
];

export default class MenuSide extends React.Component {
  _renderHeader(section) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}
        <Ionicons name="ios-arrow-down" size={20} />
        </Text>
      </View>
    );
  }

  _renderContent(section) {
    return (
      <View style={styles.content}>
        <Text style={styles.contentItem}>{section.content[0]}</Text>
        <Text style={styles.contentItem}>{section.content[1]}</Text>
        <Text style={styles.contentItem}>{section.content[2]}</Text>
      </View>
    );
  }

  render() {
    return (
    	<View>
    		<Text style={styles.menuHeader}>My Classes</Text>
	    	<View style={styles.accordion}>
		      <Accordion
		        sections={SECTIONS}
		        renderHeader={this._renderHeader}
		        renderContent={this._renderContent}
		        underlayColor='#40AD0D'
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
  	padding: 40,
  	paddingLeft: 30,
  	backgroundColor: '#4AC90F',
  },
  accordion: {
  	padding: 30,
  	backgroundColor: '#40AD0D',
  },
  header: {
  	paddingTop: 30,
  	paddingBottom: 30,
  },
  headerText: {
  	fontWeight: 'bold',
  }, 
  content: {

  },
  contentItem: {
  	paddingTop: 10,
  	paddingBottom: 10,
  }
});