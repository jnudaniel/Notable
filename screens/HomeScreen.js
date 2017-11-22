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
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _loadStoredText = async () => {
    try {
      let storedText = await AsyncStorage.getItem('storedNotes');
      if (storedText != null)
        this.setState({text: storedText})
    } catch (error) {
      console.log('Error fetching stored notes from AsyncStorage')
    }
  }

  constructor(props) {
    super(props);
    this.state = { text: '' };
    this._loadStoredText();
    console.log('done in constructor')
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              multiline={true}
              autogrow={true}
              placeholder="Start taking notes..."
              onChangeText={(text) => {this.setState({text})}}
              value={this.state.text}
              onEndEditing={this.saveNotes}
            />
          </View>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>lol i am tab bar info text</Text>
        </View>
      </View>
    );
  }

  saveNotes = async () => {
    console.log('attempting to save notes');
    try {
      await AsyncStorage.setItem('storedNotes', this.state.text);
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage')
    }
  };

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});