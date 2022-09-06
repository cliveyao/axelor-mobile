import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import TraceBackApiAxelor from './api/TraceBackApiAxelor';
import {Button, Screen, Text} from './components/atoms';
import {Image} from './components/molecules';

class ErrorBoundary extends Component {
  traceBackApi: TraceBackApi;

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      tracing: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidUpdate() {
    const {userId} = this.props;
    if (this.traceBackApi == null) {
      this.traceBackApi = new TraceBackApiAxelor(userId);
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState(state => ({
      ...state,
      tracing: true,
      errorMessage: error.message,
    }));
    if (this.traceBackApi) {
      this.traceBackApi
        .postError(error.message, errorInfo.componentStack)
        .finally(() => {
          this.setState(state => ({...state, tracing: false}));
        });
    }
  }

  reloadApp() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Screen>
          <View style={styles.container}>
            <Image
              resizeMode="contain"
              source={require('./modules/auth/assets/Logo_Axelor.png')}
              generalStyle={styles.imageStyle}
              imageSize={styles.imageSize}
              defaultIconSize={80}
            />
            <Text style={styles.text}>{this.state.errorMessage}</Text>
            <Button
              title="RELOAD SCREEN"
              onPress={() => this.setState({hasError: false})}
              style={styles.button}
            />
          </View>
        </Screen>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginVertical: '10%',
  },
  imageSize: {
    height: 100,
    width: '100%',
  },
  imageStyle: {
    marginHorizontal: 50,
    marginVertical: '10%',
  },
  text: {
    marginHorizontal: 10,
  },
});

const mapStateToProps = state => ({
  userId: state.user?.user?.id,
});

export default connect(mapStateToProps, undefined)(ErrorBoundary);