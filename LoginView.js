"use strict";
 
var React = require("react-native");
 
var {
    Component,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    Image,
} = React;
 
var MainView = require("./MainView");
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
 
class LoginView extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }
 
    render() {
        return (

            <View style={styles.container}>

            <Image source={require('./images/bg.png')}  style={styles.backgroundImage}/>

                <View style={styles.form}>
                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="#fff"
                        onChange={(event) => this.setState({username: event.nativeEvent.text})}
                        style={styles.formInput}
                        value={this.state.username} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        onChange={(event) => this.setState({password: event.nativeEvent.text})}
                        style={styles.formInput}
                        value={this.state.password} />
                    <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableHighlight>
                    <View style={styles.signup}>
                        <Text style={styles.greyFont}>Don't have an account?<Text style={styles.whiteFont}>  Sign Up</Text></Text>
                    </View>

                </View>
            </View>
        );
    }
 
    onSubmitPressed() {
        
        fetch("http://staging.joinlane.com/api/v1/login", 
          {
            method: "POST",   
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              }, 
            body: JSON.stringify({email: this.state.username, password: this.state.password})})
            .then((response) => response.json())
            .then((responseData) => {
   
           
                  if (responseData.hasOwnProperty('error')) {
                    alert('Invalid Email or Password!')
                  } else {
                      this.props.navigator.push({
                        title: "Home",
                        component: MainView,
                        passProps: {email: this.state.username, password: this.state.password},
                    });
                  }
      
              })
              .catch((error) => {
                console.warn(error);                 
        })
        .done();
    }
 
};
 
var styles = StyleSheet.create({
    container: {
        padding: 30,
        alignItems: "stretch"
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    form: {
        backgroundColor: 'transparent',
        marginTop: 350,
    },
    formInput: {
        height: 36,
        padding: 10,
        marginRight: 5,
        marginBottom: 5,
        marginTop: 5,
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "black",
        opacity: 0.5,
        borderRadius: 4,
        color: "white",
    },
    forgotText: {
        marginTop: 10,
        alignSelf: 'center',
        color: 'white'
    },
    button: {
        height: 36,
        flex: 1,
        backgroundColor: "orange",
        borderColor: "orange",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50,
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 18,
        color: "#ffffff",
        alignSelf: "center"
    },
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height,
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
});
 
module.exports = LoginView;