import React from 'react'
import {
  View,
  PanResponder,
  StyleSheet,
  Platform,
  Alert,
  Text,
  Image,
  CameraRoll,
  AsyncStorage
} from 'react-native'
import { takeSnapshotAsync } from "expo";
import { Button, Icon } from 'react-native-elements'
import { WebBrowser, ImagePicker } from 'expo';
import Nav from './global-widgets/nav'
import {Svg} from '../config'
const {
  G,
  Surface,
  Path
} = Svg
import Pen from '../tools/pen'
import Point from '../tools/point'
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';
const {OS} = Platform
// import Bezier from '../tools/bezier'

// Theme colors! (if you change these, you need to change them in all the screens)
var darkest_blue = '#0C0F2A';
var medium_blue = '#667797';
var light_blue = '#C9DCED';
var yellow = '#FAF57E';
var white = '#FFFFFF';
var pale_yellow = "#FAF8C6";

export default class DrawScreen extends React.Component {



  constructor(props, context) {
    super(props, context);
    this.state = {
      tracker: 0,
      currentPoints: [],
      previousStrokes: [],
      newStroke: [],
      pen: new Pen(),
    }


    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    })
    const rewind = props.rewind || function (){}
    const clear = props.clear || function (){}
    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
    }

  }

  rewind = () => {
    if (this.state.currentPoints.length > 0 || this.state.previousStrokes.length < 1) return
    let strokes = this.state.previousStrokes
    strokes.pop()

    this.state.pen.rewindStroke()

    this.setState({
      previousStrokes: [...strokes],
      currentPoints: [],
      tracker: this.state.tracker - 1,
    })
  }

  clear = () => {
    this.setState({
      previousStrokes: [],
      currentPoints: [],
      newStroke: [],
      tracker: 0,
    })
    this.state.pen.clear()
  }

  // Saves the drawing to the storage.
  // The notes screen will be able to get these drawings then from the storage.
  saveDrawing = async (result) => {
    console.log("Saving drawing.")
    try {
      await AsyncStorage.setItem("drawing", result);
    } catch (error) {
      console.log('Unable to save drawing to AsyncStorage')
      return;
    }
  };

  save = async () => {
     let result = await takeSnapshotAsync(this._canvas, {
       format: 'png',
       quality: 1,
       result: 'file',
     });
    this.saveDrawing(result);
    const { navigate } = this.props.navigation;
    navigate('Notes');
   };



  onTouch(evt) {
    let x, y, timestamp
    [x, y, timestamp] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.timestamp]
    let newPoint = new Point(x, y, timestamp)
    let newCurrentPoints = this.state.currentPoints
    newCurrentPoints.push(newPoint)

    this.setState({
      previousStrokes: this.state.previousStrokes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker
    })
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let strokes = this.state.previousStrokes
    if (this.state.currentPoints.length < 1) return
    let newElement = (
      <Path
        key={this.state.tracker}
        d={this.state.pen.pointsToSvg(this.state.currentPoints)}
        stroke={medium_blue}
        strokeWidth={this.props.strokeWidth || 4}
        fill="none"
      />
    )

    this.state.pen.addStroke(this.state.currentPoints)

    this.setState({
      previousStrokes: [...this.state.previousStrokes, newElement],
      currentPoints: [],
      tracker: this.state.tracker + 1,
    })
  }

  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.cards_container}>
        <View style={styles.top_space}></View>
        <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.main_card,
          this.props.containerStyle,
        ]}>
        <View         ref={ref => (this._canvas = ref)}
 style={styles.svgContainer} {...this._panResponder.panHandlers}>

          <Svg style={styles.drawSurface}>
            <G>
              {this.state.previousStrokes}
              <Path
                key={this.state.tracker}
                d={this.state.pen.pointsToSvg(this.state.currentPoints)}
                stroke={medium_blue}
                strokeWidth={this.props.strokeWidth || 4}
                fill="none"
              />
            </G>
          </Svg>
          {this.props.children}
        </View>
        </View>
        <View style={styles.buttonContainer}>
            <Button
              style = {styles.button}
              onPress={this.clear}
              title="Clear"
              accessibilityLabel="Clear everything you have drawn"
            />
            <Button
              style = {styles.button}
              onPress={this.save}
              title="Save"
              accessibilityLabel="Save everything you have drawn"
            />
            <Button
              style = {styles.button}
              onPress={this.rewind}
              title="Undo"
              accessibilityLabel="Undo whatever you just drew"
            />
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',
    backgroundColor: light_blue
  },
  svgContainer: {
    flex: 1,
  },
  drawSurface: {
    flex: 1,
  },
  button: {
    backgroundColor: yellow, // for some reason, the button isn't styling color
    overflow: 'hidden',
    borderRadius: 10,
  },
  cards_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    backgroundColor: light_blue
  },
  main_card: {
    flex: 20,
    display: 'flex',
    backgroundColor: white,
    width: '90%',
    height: '90%',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  top_space: {
    flex: 1,
    display: 'flex',
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    margin: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: light_blue,
    alignItems: 'center'
  },
})
