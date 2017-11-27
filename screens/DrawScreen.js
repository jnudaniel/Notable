// import React, { Component } from 'react';
// import { Text } from 'react-native';
//
// export default class HelloWorldApp extends Component {
//   render() {
//     return (
//       <Text>I commented out the actual code bc everything breaks for some reason!!</Text>
//     );
//   }
// }

import React, { Component } from 'react';
import { StyleSheet, Button, Text, View, Alert, CameraRoll } from 'react-native';
import { takeSnapshotAsync } from "expo";

import RNDraw from 'rn-draw'



export default class DrawScreen extends React.Component {
  render() {
    return (

      <View style={styles.container}>
        <RNDraw
          ref={ref => (this._canvas = ref)}
          containerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
          rewind={(undo) => {this._undo = undo}}
          clear={(clear) => {this._clear = clear}}
          color={'#000000'}
          strokeWidth={4}
          />
        <View style={styles.buttonContainer}>
            <Button
              style = {styles.button}
              onPress={this.undo}
              title="Undo"
              accessibilityLabel="Undo whatever you just drew"
            />
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
        </View>


       </View>
    );
  }

  undo()
  {
    //this._canvas.rewind
    Alert.alert(
     'Undo button pressed!',
     'You did it!',
   );
  }
  clear()
  {
    //this.refs['drawpad'].clear()
    Alert.alert(
     'Clear button pressed!',
     'You did it!',
   );
  }

  save = async () => {
   let result = await takeSnapshotAsync(this._canvas, {
     format: 'png',
     quality: 1,
     result: 'file',
   });

   let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
   Alert.alert(
    'Saved to your photos!',
    'Horray!',
  );
 };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightcyan'
  },
  button: {
    color: 'skyblue',
  },
  buttonContainer: {
    margin: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'lavender'
  },
});
