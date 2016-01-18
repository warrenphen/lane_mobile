"use strict";
 
var React = require("react-native");
 
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
    ListView,
    Image,
    TabBarIOS,
    TouchableOpacity,
} = React;
 
class MainView extends React.Component {
 
    constructor(props) {
        super(props);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }

        this.state = {
            loaded : false,
            dataSource : new ListView.DataSource({
                getSectionData          : getSectionData,
                getRowData              : getRowData,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            })
        }

        this.bindMethods();

    }

    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }   

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }

    componentDidMount () {
        this.fetchData();
    }
 
    fetchData () {
        fetch("http://staging.joinlane.com/api/v1/lane/subscriber/subscriptions", 
          {
            method: "POST",   
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              }, 
            body: JSON.stringify(
              {"userId": this.state.id,
               "geo":
                  {
                    "_type": "GeoJSON",
                    "type": "Point", 
                    "coordinates": [79.391594, 43.650033099999995],
                  },
                "tz":"America/Toronto"
              }
            )
          })
            .then((response) => response.json())
            .then((responseData) => {
 
            var subscriptions = responseData.subscriptions,
            length = subscriptions.length,
            dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            subscription,
            feed,
            feeds,
            feedLength,
            i,
            j;
            
            for (i = 0; i < length; i++) {
            subscription = subscriptions[i];

            // Add Section to Section ID Array
            sectionIDs.push(subscription._id);
            // Set Value for Section ID that will be retrieved by getSectionData
            dataBlob[subscription._id] = subscription.name.en;

            feeds = subscription.feed;
            feedLength = feeds.length;
            
            // Initialize Empty RowID Array for Section Index
            rowIDs[i] = [];

            for(j = 0; j < feedLength; j++) {
                feed = feeds[j];

                // Add Unique Row ID to RowID Array for Section
                rowIDs[i].push(feed._id);

                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob[subscription._id + ':' + feed._id] = feed.content;
                // dataBlob[subscription.id + ':' + Feeds.description._id] = FeedDescription;
            }
        }

            this.setState({
                dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded     : true
            });

        })
        .done();
    }

  render () {
       if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return this.renderListView();
    }

  renderListView() {
      return (
            <View style={styles.container}>
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
                />
            </View>
      );
  }

  renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.text}>{sectionData}</Text>
            </View>
        ); 
    }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading subscriptions...
        </Text>
      </View>
    );
  }

} 

Object.assign(MainView.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.imageContainer}>
                      <Image source={require('./images/bg.png')} style={styles.feedImage}/>
                    </View>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowTitle}>{rowData.name.en} </Text> 
                        <Text style={styles.rowText}>{rowData.description.en} </Text>        
                    </View>
                </TouchableOpacity>
            );
        },
        onPressRow : function (rowData, sectionID) {
            var buttons = [
                {
                    text : 'Cancel'
                },
                {
                    text    : 'OK',
                    onPress : () => this.createCalendarEvent(rowData, sectionID)
                }
            ]
            AlertIOS.alert('User\'s Email is ' + rowData.email, null, null);
        }

    }
});
 
var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        backgroundColor: "#f4f4f4"
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10,
    },
    rowTitle: {
        fontSize: 20
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        marginBottom: 10,
        backgroundColor: 'orange'
    },
    feedImage: {
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        width: 355,
        height: 200,
    },
      imageContainer: {
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        width: 355,
        height: 200,
    }
});
 
module.exports = MainView;