import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Calendar from './Calendar';
import EventNew from './events/EventNew';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="maincontainer">
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/calendar" component={Calendar} />
          <div className="container">
            <Route path="/calendar/new" component={EventNew} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
