import React from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { Button } from 'react-native-elements'


const SECTIONS = [
  {
    title: 'CS 147',
    content: ['Lecture 1: Design', 'Lecture 2: User Interviews', 'Lecture 3: More Interviews', 'Lecture 4: Exam Review'],
  },
  {
    title: 'HUMBIO 155H',
    content: ['Lecture 1: Polyomavirus', 'Lecture 2: Zika Virus', 'Lecture 3: Innoculation'],
  },
  {
    title: 'CS 109',
    content: ['Lecture 1: Counting', 'Lecture 2: Combinatorics', 'Lecture 3: Sampling'],
  },
  {
    title: 'INTNLREL 140A',
    content: ['Lecture 1: America', 'Lecture 2: Russia', 'Lecture 3: Proxy Wars','Lecture 4: Net Neutrality' ],
  },
];

export default class MenuSide extends React.Component {
  _renderHeader(section) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  }
  _handleButtonPress = () => {
     Alert.alert(
       'Button pressed!',
       'You did it!',
     );};

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
		        sections={SECTIONS}
		        renderHeader={this._renderHeader}
		        renderContent={this._renderContent}
		        underlayColor='#E0FFFF'
		      />
          <Button
            title="New Class"
            onPress={this._handleButtonPress}
            backgroundColor = '#008080'
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
  	backgroundColor: '#AFEEEE',
  },
  accordion: {
  	padding: 15,
  	backgroundColor: '#E0FFFF',
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
  }
});
