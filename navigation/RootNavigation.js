import { Notifications } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import MenuSide from '../components/MenuSide';
import SideMenu from 'react-native-side-menu';
import NotesScreen from '../screens/NotesScreen';
import CompareScreen from '../screens/CompareScreen';
import DrawScreen from '../screens/DrawScreen';
import AddClass from '../screens/AddClass';


const RootStackNavigator = StackNavigator(
  {
    Login: {
      screen: AddClass,
    },
    Notes: {
      screen: NotesScreen,
    },
    Draw: {
      screen: DrawScreen,
    },
    Compare: {
      screen: CompareScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default class RootNavigator extends React.Component {
  constructor(props) {
  super(props);

  this.toggle = this.toggle.bind(this);

  this.state = {
    isOpen: false,
  };
}
  state = {currentScreen: null}

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _onNavigationStateChange = (prevState, newState) => {
    this.setState({...this.state, route_index: newState.index});
  }

  toggle() {
   this.setState({
     isOpen: !this.state.isOpen,
   });
 }

  render() {
    const menuContents = <MenuSide />

    return (
      <SideMenu menu={menuContents}>
       <RootStackNavigator onNavigationStateChange={this._onNavigationStateChange} screenProps={this.state}/>
       </SideMenu>

       // <TouchableOpacity
       //   onPress={this.toggle}
       // >
       //   <Image
       //     source={{uri: 'https://cdn4.iconfinder.com/data/icons/tupix-1/30/list-512.png'}}
       //     style={{ width: 32, height: 32 }}
       //   />
       // </TouchableOpacity>
      );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}
