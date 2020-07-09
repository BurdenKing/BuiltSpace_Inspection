import React, {Component} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({});
export const AccountContext = React.createContext({});

export const ContextInfo = React.createContext();

class ContextInfoProvider extends Component {
  /**
   * Creates a context variable for network status and account info.
   * The context info can be accessed by any screen that it wraps around. (see Navigator.js)
   */
  state = {
      isConnected: true,
      account: {
        email: '',
        api_key: '',
        id: '',
      },
    };
  

  setAccountContext = accountDetails => {
    this.setState({account: accountDetails});
  };

  componentDidMount() {
    NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(this.handleConnectivityChange);
  }

  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({isConnected: true});
    } else {
      this.setState({isConnected: false});
    }
  };

  render() {
    return (
      <NetworkContext.Consumer>
        {networkContext => (
          <AccountContext.Consumer>
            {accountContext => (
              <ContextInfo.Provider value={{networkContext: {isConnected: this.state.isConnected}, accountContext: {account: this.state.account,setAccount: this.setAccountContext}}}>
                {this.props.children}
              </ContextInfo.Provider >
            )}
          </AccountContext.Consumer>
        )}
      </NetworkContext.Consumer>
    );
  }
}

export default ContextInfoProvider;
