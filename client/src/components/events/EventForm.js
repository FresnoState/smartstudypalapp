import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../../actions';
import moment from 'moment';
const btndivStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};
const labelStyle = {
  fontSize: '1.2rem',
  color: '#999'
};

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      start: '',
      end: '',
      classid: '',
      clickedSearch: null
    };
    this.state.event = [];
  }

  updateDateValue(evt) {
    this.setState({
      date: evt.target.value
    });
  }
  updateStartValue(evt) {
    this.setState({
      start: evt.target.value
    });
  }
  updateEndValue(evt) {
    this.setState({
      end: evt.target.value
    });
  }
  updateClassIDValue(evt) {
    this.setState({
      classid: evt.target.value
    });
  }

  handleClick(evt) {
    var eventStr =
      this.state.classid +
      ',' +
      this.state.start +
      ',' +
      this.state.end +
      ',' +
      this.state.date;
    this.props.matchEvents(eventStr);
    // console.log('before ', this.state);
    this.setState({ clickedSearch: true });
    // console.log('after ', this.state);
  }

  renderMatchedEvents(props) {
    // console.log('test ', this.props.events);
    return this.props.events.map(event => {
      // console.log('event is: ', event);
      return (
        <div id="event-view">
          <div className="row">
            <div className="col s12 m6">
              <div className="card blue-grey darken-1" key={event._id}>
                <div className="card-content white-text">
                  <span className="card-title">
                    {'Event title: ' + event.title}
                  </span>
                  <p>
                    {'Start Time: ' +
                      moment(event.start).format('MM/DD/YYYY h:mm a')}
                  </p>
                  <p>
                    {'End Time: ' +
                      moment(event.end).format('MM/DD/YYYY h:mm a')}
                  </p>
                  <p>{'Number of attendees: ' + event.attendees}</p>
                </div>
                <div className="card-action">
                  <button
                    className="waves-effect waves-light btn"
                    onClick={() =>
                      props.joinEvent(
                        {
                          id: event._id,
                          classid: event.classId
                        },
                        props.history
                      )
                    }
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(values =>
            this.props.submitEvent(values, this.props.history)
          )}
        >
          <label style={labelStyle}>Study Date:</label>
          <Field
            type="date"
            name="date"
            component="input"
            onChange={evt => this.updateDateValue(evt)}
          />
          <label style={labelStyle}>Start Time:</label>
          <Field
            type="time"
            name="start"
            component="input"
            onChange={evt => this.updateStartValue(evt)}
          />
          <label style={labelStyle}>End Time:</label>
          <Field
            type="time"
            name="end"
            component="input"
            onChange={evt => this.updateEndValue(evt)}
          />
          <label style={labelStyle}>Event Title:</label>
          <Field type="text" name="event" component="input" />
          <label style={labelStyle}>Class ID:</label>
          <Field
            type="text"
            name="classid"
            component="input"
            onChange={evt => this.updateClassIDValue(evt)}
          />
          <div style={btndivStyle}>
            <div>
              <Link to="/calendar" className="red btn-flat white-text">
                Cancel
              </Link>
            </div>
            <div>
              <input
                className="blue btn-flat right white-text"
                type="button"
                value="Search Study Session"
                onClick={evt => this.handleClick(evt)}
              />
            </div>
            <div>
              <button className="teal btn-flat right white-text" type="submit">
                Add Event
                <i className="material-icons right">done</i>
              </button>
            </div>
          </div>
        </form>
        {this.state.clickedSearch &&
        this.state.date !== '' &&
        this.state.start !== '' &&
        this.state.end !== '' &&
        this.state.classid !== ''
          ? this.renderMatchedEvents(this.props)
          : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { events: state.events };
}

export default connect(mapStateToProps, actions)(
  reduxForm({
    form: 'eventForm'
  })(withRouter(EventForm))
);
