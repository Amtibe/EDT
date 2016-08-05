'use strict';

import React, { Component } from 'react';
import {
  Image,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

var SearchResults = require('./SearchResults');

var NEW_LINE = /\r\n|\n|\r/,
    convertICS;

convertICS = function(source) {
  //console.log(source);
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
      lines = source.split(NEW_LINE),
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
  //console.log(output);
  return output;
};

function urlEdt(){
  var data = {
    projectId:8,
    resources: '6407,6409,610,608,4822,4821,6412,6408,672,674,673,682,681,680',
    calType: 'ical',
    firstDate: '2016-02-08',
    lastDate: '2016-02-14'
  };
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://ade-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?' + querystring;
}

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

//compare by start date
function compare(a,b) {
  if (a.DTSTART < b.DTSTART)
    return -1;
  if (a.DTSTART > b.DTSTART)
    return 1;
  return 0;
}

export default class SearchPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };

  }

  //To go directly on the good page
  componentDidMount(){
    //var query = urlEdt();
    //this._executeQuery(query);
  }

  _executeQuery(query) {
    console.log(query);
    this.setState({ isLoading: true });
    fetch(query)
      .then(response => response.text())
      .then(text => this._handleResponse(text))
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  }

  _handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    if (response) {
      var jsonCal = convertICS(response);
      var events = jsonCal.VCALENDAR[0].VEVENT;
      events.sort(compare);

      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: events}
       });
    } else {
      this.setState({ message: 'No events...'});
    }
  }

  onSearchPressed() {
    var query = urlEdt();
    this._executeQuery(query);
  }

  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({ searchString: event.nativeEvent.text });
    console.log(this.state.searchString);
  }

  render(){
    var spinner = this.state.isLoading ?
    ( <ActivityIndicator
      size='large'/> ) :
      ( <View/>);
      return (
        <View style={styles.container}>




            <Text style={styles.description}>Pôles</Text>
            <SegmentedControlIOS values={['Etoile', 'Luminy']} />

            <Text style={styles.description}>Filieres</Text>
            <SegmentedControlIOS values={['Etoile', 'Luminy']} />



        <View style={styles.container}>
          <Text style={styles.description}>Search for your house to buy</Text>
          <Text style={styles.description}>Search by place-name, postcode or search near your location.</Text>
          <View style={styles.flowRight}>
          <TextInput
          style={styles.searchInput}
          value={this.state.searchString}
          onChange={this.onSearchTextChanged.bind(this)}
          placeholder='Search via name or postcode'/>
          <TouchableHighlight style={styles.button}
          underlayColor='#99d9f4'>
          <Text
            style={styles.buttonText}
            onPress={this.onSearchPressed.bind(this)}
          >
            Go
          </Text>
          </TouchableHighlight>
          </View>
          <TouchableHighlight style={styles.button}
          underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Location</Text>
          </TouchableHighlight>
          <Image source={require('./Resources/house.png')} style={styles.image}/>
          {spinner}

          <Text style={styles.description}>{this.state.message}</Text>
        </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({

    container: {
      padding:10,
      //alignItems: 'center'
    },
    description: {
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'center',
      color: 'black'
    },
    flowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch'
    },
    buttonText: {
      fontSize: 18,
      color: 'black',
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
    searchInput: {
      height: 36,
      padding: 4,
      marginRight: 5,
      flex: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48BBEC',
      borderRadius: 8,
      color: '#48BBEC'
    },
    image: {
      width: 217,
      height: 20
    }
  });
