import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../../actions';
import moment from 'moment';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
const btndivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap'
};
const labelStyle = {
  fontSize: '1.2rem',
  color: '#999'
};
const margbottom = {
  margin: '0 0 20px 0'
};

const eventView = {
  position: 'absolute',
  zIndex: '7',
  top: '25%',
  left: '33%',
  width: '70%'
};

//Nees to be updated to dynamically pull users schedule
const classIDS = [
  { class: 'CSCI 119', value: '119' },
  { class: 'CSCI 117', value: '117' },
  { class: 'CSCI 172', value: '172' }
];

const renderDropdownList = ({ input, data, valueField, textField }) => (
  <DropdownList
    {...input}
    data={data}
    valueField={valueField}
    textField={textField}
    onChange={input.onChange}
  />
);

const ErrorMessage = props => {
  console.log('ErrorMessage props are: ', props);
  return (
    <div style={eventView} id="event-view">
      <div className="row">
        <div className="col s12 m6">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Error:</span>
              <p>You already have a study session during this time.</p>
            </div>
            <div className="card-action">
              <button
                className="waves-effect waves-light btn"
                onClick={props.closeErrorView}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
    // console.log(evt.target.value);
    // console.log(evt.value);
    this.setState({
      classid: evt.value
    });
  }

  handleDisplay() {
    console.log(this.state);
    this.setState({
      isHidden: !this.state.isHidden
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
    var closeViewprop = {
      closeErrorView: this.handleDisplay.bind(this)
    };
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(values =>
            this.props.submitEvent(values, this.props.history).then(val => {
              console.log('test this');
              if (val.length === 0) {
                this.setState({
                  isHidden: !this.state.isHidden
                });
              }
            })
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
          <div style={margbottom}>
            <label style={labelStyle}>Class ID:</label>
            <Field
              name="favoriteColor"
              component={renderDropdownList}
              data={classIDS}
              valueField="value"
              textField="class"
              onChange={evt => this.updateClassIDValue(evt)}
            />
          </div>
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

        {this.state.isHidden && <ErrorMessage {...closeViewprop} />}
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
