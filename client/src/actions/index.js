import axios from 'axios';
import { FETCH_USER, FETCH_EVENTS, MATCH_EVENTS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchEvents = () => async dispatch => {
  const res = await axios.get('/api/events');

  dispatch({ type: FETCH_EVENTS, payload: res.data });
};

export const submitEvent = (values, history) => async dispatch => {
  const res = await axios.post('/api/events', values);
  console.log('res data is', res.data);
  if (res.data === 'error') {
    return [];
  } else {
    history.push('/calendar');
    dispatch({ type: FETCH_EVENTS, payload: res.data });
  }
};

export const joinEvent = (values, history) => async dispatch => {
  console.log(values);
  const res = await axios.post('/api/joinevent', values);
  history.push('/calendar');
  dispatch({ type: FETCH_EVENTS, payload: res.data });
};

export const matchEvents = eventStr => async dispatch => {
  const res = await axios.get('/api/matchedevents/' + eventStr);
  dispatch({ type: MATCH_EVENTS, payload: res.data });
};

export const deleteEvent = eventID => async dispatch => {
  var test = eventID._id + ',' + eventID.classId;

  console.log('deleteEvent ', test);
  const res = await axios.delete('/api/delete/' + test);
  // dispatch({ type: FETCH_EVENTS, payload: res.data });
};
