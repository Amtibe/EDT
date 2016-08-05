
'use strict';

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, NavigatorIOS, Navigator } from 'react-native';

import SelectionFiliere from './App/Components/SelectionFiliere';

class PropertyFinderApp extends Component {
  render(){
    return (
      <NavigatorIOS
        itemWrapperStyle={styles.navWrap}
        style={styles.nav}
        initialRoute={{
          title: 'EDT',
          component: SelectionFiliere,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  navWrap: {
      flex: 1,
      marginTop: 70
    },
    nav: {
      flex: 1,
    },
});

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinderApp);
