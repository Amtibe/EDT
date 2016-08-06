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
var Schedule = require('./Schedule');

var datas = require('../Resources/ids.json');

var yearsInge = ['3A','4A','5A'];
var yearsPEIP = ['1A','2A'];

//Move these functions in a future
function convertICS(source) {
  var currentKey = "",
  currentObj,
  currentValue = "",
  line,
  objectNames = [],
  output = {},
  parents,
  parentObj = {},
  i,
  linesLength,
  lines = source.split(/\r\n|\n|\r/),
  splitAt;

  currentObj = output;
  parents = [];

  for (i = 0, linesLength = lines.length; i < linesLength; i++) {
    line = lines[i];
    if (line.charAt(0) === " ") {
      currentObj[currentKey] += line.substr(1);

    } else {
      splitAt = line.indexOf(":");

      if (splitAt < 0) {
        continue;
      }

      currentKey = line.substr(0, splitAt);
      currentValue = line.substr(splitAt + 1);

      switch (currentKey) {
        case "BEGIN":
        parents.push(parentObj);
        parentObj = currentObj;
        if (parentObj[currentValue] == null) {
          parentObj[currentValue] = [];
        }
        currentObj = {};
        parentObj[currentValue].push(currentObj);
        break;
        case "END":
        currentObj = parentObj;
        parentObj = parents.shift();
        break;
        default:
        if(currentObj[currentKey]) {
          if(!Array.isArray(currentObj[currentKey])) {
            currentObj[currentKey] = [currentObj[currentKey]];
          }
          currentObj[currentKey].push(currentValue);
        } else {
          currentObj[currentKey] = currentValue;
        }
      }
    }
  }
  return output;
}

function compare(a,b) {
  if (a.DTSTART < b.DTSTART)
  return -1;
  if (a.DTSTART > b.DTSTART)
  return 1;
  return 0;
}

//  View to select a specific student group
var SelectionFiliere = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
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
      if(datas[this.state.pole].resources[this.state.filiere].label == "PEIP"){
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
          <TouchableHighlight
          style={styles.button}
          onPress={this._onPressButton}
          underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
      )
    }
  },

  _onPressButton: function(){
    var query = this._urlEdt();
    this._executeQuery(query);
  },

  _urlEdt(){
    // Example :
    // https://ade-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=1&resources=4885,4884,4883&calType=ical&firstDate=2016-02-22&lastDate=2016-02-28
    var stringResources = datas[this.state.pole].resources[this.state.filiere].resources[this.state.year].resources.toString();

    var data = {
      projectId:1, //never changed
      resources: stringResources, //student class
      calType: 'ical', //never change
      firstDate: '2016-02-08', // date range
      lastDate: '2016-02-14' // date range
    };
    var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

    return 'https://ade-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?' + querystring;
  },

  _executeQuery: function(query){
    this.setState({ isLoading: true });
    fetch(query)
    .then(response => response.text())
    .then(text => this._handleResponse(text))
    .catch(error =>
      this.setState({ isLoading: false })
    );
  },

  _handleResponse: function(response) {
    this.setState({ isLoading: false });
    if (response) {
      var jsonCal = convertICS(response);
      var events = jsonCal.VCALENDAR[0].VEVENT; //Only one calendar per request
      events.sort(compare); // Sort events by start date
      this.props.navigator.push({
        title: 'Schedule',
        component: Schedule,
        passProps: {listings: events}
      });
    }
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
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});

module.exports = SelectionFiliere;
