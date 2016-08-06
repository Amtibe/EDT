/**
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Text,
  View,
  SegmentedControlIOS,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var datas = require('../Resources/ids.json');
var config = require('../Resources/ids.json');

var yearsInge = ['3A','4A','5A'];
var yearsPEIP = ['1A','2A'];

console.log(datas);


var SelectionFiliere = React.createClass({

  getInitialState: function() {
    return {
      pole:null,
      filiere:null,
      year:null,
    };
  },

  _renderFilieres: function(){
    if(this.state.pole !== null)
    return (
      <View>
      <Text>Filieres</Text>
      <SegmentedControlIOS
      values={datas[this.state.pole].filieres}
      onChange={(event) => {
        this.setState({filiere: event.nativeEvent.selectedSegmentIndex});
      }}
      />
      </View>
    );
  },

  //if PEIP render different view
  _renderYear: function(){
    if(this.state.pole !== null && this.state.filiere !== null)
    {
      var years = [];
      if(datas[this.state.pole].ressources[this.state.filiere].label == "PEIP"){
        years = yearsPEIP;
      } else {
        years = yearsInge;
      }

      if(this.state.filiere !== null)
      return(
        <View>
        <Text>Années</Text>
        <SegmentedControlIOS
        values={years}
        onChange={(event) => {
          this.setState({year: event.nativeEvent.selectedSegmentIndex});
        }}
        />
        </View>
      )
    }
  },

  _renderButton: function(){
    if (this.state.pole !== null && this.state.filiere !== null && this.state.year !== null) {
      return(
        <View>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text>GO</Text>
        </TouchableHighlight>
        </View>
      )
    }
  },

  _onPressButton: function(){

  },

  render: function() {
    return (
      <View style={styles.container}>
      <Text>Pôles</Text>
      <SegmentedControlIOS
      values={datas.map(p => p.label)}
      onChange={(event) => {
        this.setState({pole: event.nativeEvent.selectedSegmentIndex});
      }}
      />
      {this._renderFilieres()}
      {this._renderYear()}
      {this._renderButton()}
      </View>
    )
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    //backgroundColor: 'whit',
  },
});

module.exports = SelectionFiliere;
