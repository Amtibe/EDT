'use strict';

var moment = require('moment-timezone');
var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,Text, View, TouchableHighlight , ListView
} = ReactNative;

var utcOffset = moment().tz("Europe/Paris").format('Z');
var formatIcal = 'YYYYMMDDTHHmmssZ';

var Schedule = React.createClass({
  getInitialState: function() {
    return {
      loaded : false,
      dataSource : new ListView.DataSource({
          getSectionData          : (dataBlob, sectionID) => {
                return dataBlob[sectionID];
            },
          getRowData              : (dataBlob, sectionID, rowID) => {
              return dataBlob[sectionID + ':' + rowID];
          },
          rowHasChanged           : (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2
      })
    };
  },

  componentDidMount: function() {
      this._renderListViewData(this.props.listings);
  },

  _renderListViewData: function(events){
    var data = {},
        sectionIds = [],
        objRowIds = {},
        rowIds = [],
        setSectionIds = new Set(),
        currentSection = '';


    events.forEach(function(event){
        currentSection = moment.utc(event.DTSTART, formatIcal).utcOffset(utcOffset).format('X')
        setSectionIds.add(currentSection);
        //Store section
        data[currentSection] = moment.utc(event.DTSTART, formatIcal).utcOffset(utcOffset).format('Do MMM, HH:mm');

        //Store rowsid
        if(objRowIds[currentSection] == null){
          objRowIds[currentSection] = [];
        }
        objRowIds[currentSection].push(event.UID);

        //Store event
        data[currentSection + ':' + event.UID] = event;
    });

    sectionIds = Array.from(setSectionIds);
    rowIds = Object.values(objRowIds);

    this.setState({
         dataSource : this.state.dataSource.cloneWithRowsAndSections(data, sectionIds, rowIds),
         loaded     : true
     });
  },

  renderRow :function(rowData, sectionID, rowID) {
    /*
      CREATED:"19700101T000000Z"
      DESCRIPTION:"\nInfo_4\nQUAFAFOU Mohamed\n(Exported :28/07/2016 14:40)"
      DTEND:"20160208T140000Z"
      DTSTAMP:"20160728T124004Z"
      DTSTART:"20160208T120000Z"
      LAST-MODIFIED:"20160728T124004Z"
      LOCATION:"A101"
      SEQUENCE:"1621052804"
      SUMMARY:"Ext Connaissances CM"
      UID:"ADE60556e6976657273697465323031355f323031362d373231332d302d30"
    */

    var location = rowData.LOCATION && rowData.LOCATION.toUpperCase();
    var description = rowData.DESCRIPTION.split('\\n');
    description.pop();description.shift();
    description = description.join(' - ');
    //var DTSTART = moment.utc(rowData.DTSTART, formatIcal).utcOffset(utcOffset).format(formatDisplay);

    return (
      <View style={styles.cell}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>
            {rowData.SUMMARY}
          </Text>
        </View>
        <Text  style={styles.duration}>
          <Text style={styles.locationText}>
            {location}
          </Text>
           {' - '}{description}
        </Text>
      </View>
    );
  },

  renderSectionHeader: function(sectionData, sectionID) {
      return (
          <View style={styles.header}>
              <Text style={styles.label}>
                {sectionData}
              </Text>
          </View>
      );
  },

  render: function(){
    return(
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
        />
    );
  },

});

const styles = StyleSheet.create({
  cell: {
    paddingVertical: 10,
    paddingLeft: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  titleSection: {
    paddingRight: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAndDuration: {
    justifyContent: 'center',
  },
  titleText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: '#032250',
    marginBottom: 4,
    marginRight: 10,
  },
  duration: {
    fontSize: 12,
    color: '#7F91A7',
  },
  locationText: {
    fontSize: 12,
    color:'black',
  },
  added: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
  header: {
    paddingVertical: 2,
    backgroundColor:'#F4F6F7', // '#F4F6F7' '#EBEEF1'
    justifyContent: 'center',
    paddingLeft: 17,
  },
  label: {
    color: '#7F91A7',
  },
});

module.exports = Schedule;
