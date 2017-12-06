import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchEvents, deleteEvent } from '../actions';
import { Link } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import $ from 'jquery';
const btn_style = { backgroundColor: '#0F3E86' };
const cal_margin = { margin: '0px 10px' };

BigCalendar.momentLocalizer(moment);

const EventView = props => {
  return (
    <div className="eventView" id="event-view">
      <div className="row">
        <div className="col s12 m6">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">
                {'Event title: ' + props.event.title}
              </span>
              <p>
                {'Start Time: ' +
                  moment(props.event.start).format('MM/DD/YYYY h:mm a')}
              </p>
              <p>
                {'End Time: ' +
                  moment(props.event.end).format('MM/DD/YYYY h:mm a')}
              </p>
              <p>{'Number of attendees: ' + props.event.attendees}</p>
            </div>
            <div className="card-action" style={{ display: 'flex' }}>
              {props.event.attendees === undefined ? (
                ''
              ) : (
                <button
                  className="waves-effect waves-light btn"
                  // onClick={() => props.delete(props.event._id)}
                  onClick={() => props.delete(props.event)}
                >
                  Leave
                </button>
              )}
              <button
                className="waves-effect waves-light btn btn-right"
                onClick={props.closeEventView}
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

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedevent: null
    };
  }

  componentDidMount() {
    this.props.fetchEvents();
  }

  toggleEventView() {
    // console.log('inside toggle');
    $('#event-view').fadeToggle('slow');
  }

  onSelectEvent(event) {
    // console.log(event);
    this.setState({ selectedevent: event });
    // console.log(this.state);
    // return this.toggleEventView;
    // this.toggleEventView;
  }

  closeEventView() {
    this.setState({ selectedevent: null });
  }

  deleteCurrEvent(event) {
    // console.log(event);
    // console.log(this.props);
    this.props.deleteEvent(event);
    this.closeEventView();
    this.props.fetchEvents();
  }

  render() {
    var eventprops = {
      slotSelected: this.slotSelected,
      closeEventView: this.closeEventView.bind(this),
      event: this.state.selectedevent,
      delete: this.deleteCurrEvent.bind(this)
    };

    return (
      <div>
        <MyCal
          events={this.props.events}
          onSelectEvent={this.onSelectEvent.bind(this)}
        />
        {this.state.selectedevent ? <EventView {...eventprops} /> : null}
        <div className="fixed-action-btn">
          <Link
            to="/calendar/new"
            className="btn-floating btn-large"
            style={btn_style}
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}

const MyCal = props => {
  return (
    <div id="mycalendar" style={cal_margin}>
      <BigCalendar
        events={props.events}
        style={{ height: '90vh' }}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={props.onSelectEvent}
      />
    </div>
  );
};

function mapStateToProps({ events }) {
  return { events };
}

export default connect(mapStateToProps, { fetchEvents, deleteEvent })(Calendar);
