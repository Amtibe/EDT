
/**
 * index for EDT application
 *
 * @providesModule MoviesApp
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = ReactNative;

import SelectionFiliere from './App/Components/SelectionFiliere';
//var SelectionFiliere = './App/Components/SelectionFiliere';

class EdtApp extends React.Component {
  render(){
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'EDT',
          component: SelectionFiliere,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('EdtApp', () => EdtApp);

module.exports = EdtApp;
