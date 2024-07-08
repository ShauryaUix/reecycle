
import React, { Component, createContext} from 'react';



const initialContextState = {
  isVisible: false,
  setIsVisible: () => {},
};

const Context = createContext(initialContextState);

export const { Consumer } = Context;

export class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      setIsVisible: this.setIsVisible,
    };
  }

  setIsVisible = (visible) => {
    this.setState({
      isVisible: !!visible,
    });
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
