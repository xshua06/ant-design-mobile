import * as React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  BackAndroid,
} from 'react-native';
import codePush from 'react-native-code-push';
import { Scene, Router, Reducer, Actions, ActionConst } from 'react-native-router-flux';

import Home from './components/Home';
import RnIndex from './components/RnIndex';
import WebIndex from './components/WebIndex';
import { APIS, COMPONENTS } from './demoList';

const styles = StyleSheet.create({
  content: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  navigationBarStyle: {
    backgroundColor: '#2e2e2e',
  },
  titleStyle: {
    color: 'white',
  },
});

let isMainScreen = false;
const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    if (action.type === ActionConst.FOCUS && action.scene && action.scene.initial) {
      isMainScreen = true;
    } else {
      isMainScreen = false;
    }
    return defaultReducer(state, action);
  };
};

class AntmRnApp extends React.Component {
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (!isMainScreen) {
        Actions.pop();
        return true;
      }
      return false;
    });
  }

  componentDidMount() {
    codePush.sync({
      updateDialog: {
        updateTitle: '检测有更新',
        optionalUpdateMessage: 'demo app 有新版本，是否安装？',
        optionalIgnoreButtonLabel: 'No',
        optionalInstallButtonLabel: 'Yes',
      },
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  render() {
    const scenes = APIS.concat(COMPONENTS).map(component => {
      const Module = component.module.default;
      let Component = React.createClass({
        render() {
          return (
            <View style={styles.content}>
              <Module />
            </View>
          );
        },
      });

      if (component.title === 'Drawer') {
        const DrawerMainComponent = React.createClass({
          render() {
            return (
              <component.module.DrawerMain drawerComponent={Module} />
            );
          },
        });
        return (
          <Scene key="Drawer" component={Module} duration={200} direction="vertical">
            <Scene key="main" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle}>
              <Scene key={`${component.title}Sub`} component={DrawerMainComponent} title={component.title} />
            </Scene>
          </Scene>
        );
      }
      return <Scene key={component.title} component={Component} title={component.title} />;
    });

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <Router createReducer={reducerCreate}>
          <Scene key="root" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle}>
            <Scene key="home" component={Home} title="Ant Design Mobile" initial />
            <Scene key="web" component={WebIndex} title="Antm Web Component" />
            <Scene key="native" component={RnIndex} title="Antm React Native" />
            {scenes}
          </Scene>
        </Router>
      </View>
    );
  }
}

AppRegistry.registerComponent('kitchen-sink', () => AntmRnApp);

export default AntmRnApp;
