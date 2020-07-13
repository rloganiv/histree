import 'bootstrap';
import React, { Component } from 'react';

import Tree from './modules/Tree';
import Hist from './modules/Hist';
import MList from './modules/MList';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.setActiveNode = this.setActiveNode.bind(this)
    this.state = {
      activeNode: null
    }
  }

  setActiveNode(node) {
    console.log(node)
    this.setState({
      activeNode: node
    })
  }

  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row h-100">
            <div className="col-8 h-100">
              <div className="row h-80">
                <Tree setActiveNode={this.setActiveNode}/>
              </div>
              <div className="row h-20">
                <Hist data={[]} activeNode={this.state.activeNode}/>
              </div>
            </div>
            <div className="col-4">
              <MList activeNode={this.state.activeNode}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
