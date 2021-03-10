import React from 'react';
import { View, Alert, Dimensions } from 'react-native';
import Main from './components/MainComponent';

export default class App extends React.Component {
  render(){
    return(
      
        <View style={{flex:1}}>
          <Main/>
        </View>
      
    );
  }    
}

