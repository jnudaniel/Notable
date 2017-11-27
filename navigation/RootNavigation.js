import { Notifications } from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import MenuSide from '../components/MenuSide';
import SideMenu from 'react-native-side-menu';
import NotesScreen from '../screens/NotesScreen';
import CompareScreen from '../screens/CompareScreen';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
    Notes: {
    screen: NotesScreen,
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

  render() {
    const menuContents = <MenuSide />

    return (
      <SideMenu menu={menuContents}>
       <RootStackNavigator onNavigationStateChange={this._onNavigationStateChange} screenProps={this.state}/>
      </SideMenu>
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
