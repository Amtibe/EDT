import React, { Component } from 'react';
import { Text, View, SegmentedControlIOS } from 'react-native';

import styles from './Styles/SelectionFiliereStyle'

var poles = ['Etoile', 'Luminy'];
var filieres = ['GBM','GBMA','IRM','MAT','PEIP'];
var yearsInge = ['3A','4A','5A'];
var yearsPEIP = ['1A','2A'];
//var grpsPEIP = ['grp1','grp2'];

var datas = [
  {
    label:"Etoile",
    filieres:['GC','GII','ME','MT','PEIP']
  },
  {
    label:"Luminy",
    filieres:['GBM','GBMA','IRM','MAT']
  },
];

class SelectionFiliere extends Component {
  constructor(props) {
      super(props);

      this.state = {
        pole:null,
        filiere:null,
        year:null,
        //grp:null, //for PEIP only
      };
    }


  _renderFilieres(){
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
  }

  //if PEIP render different view
  _renderYear(){
    var years = [];
    if(datas[this.state.pole].filieres[4] == "PEIP"){
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

  render () {
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
      </View>
    )
  }
}

module.exports = SelectionFiliere;
