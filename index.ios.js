"use strict";
 
var React = require("react-native");
 
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS,
} = React;
 
var LoginView = require("./LoginView");
 
var LaneProject = React.createClass({
    render: function() {
        return (
            <NavigatorIOS
                style={styles.navigationContainer}
                initialRoute={{
                title: "Lane",
                component: LoginView,
            }} />
        );
    }
});
 
var styles = StyleSheet.create({
    navigationContainer: {
        flex: 1
    }
});
 
AppRegistry.registerComponent("LaneProject", () => LaneProject);