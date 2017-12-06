import { FETCH_EVENTS, MATCH_EVENTS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_EVENTS:
      var events = [];
      console.log(action.payload);

      for (var i = 0; i < action.payload.length; i++) {
        if (action.payload[i].courses === undefined) {
          events.push({
            start: new Date(action.payload[i].start),
            end: new Date(action.payload[i].end),
            title: action.payload[i].title,
            _id: action.payload[i]._id,
            attendees: action.payload[i].attendees.length,
            classId: action.payload[i].classid
          });
        } else {
          action.payload[i].courses.map(event => {
            events.push({
              start: new Date(event.start.dateTime || event.start),
              end: new Date(event.end.dateTime || event.end),
              title: event.title
            });
          });
        }
      }
      return events;
    case MATCH_EVENTS:
      var matchevents = [];
      console.log('payload is ', action.payload);

      if (action.payload.length === 0) {
        // console.log('no events matched');
      } else {
        for (var j = 0; j < action.payload.length; j++) {
          matchevents.push({
            start: new Date(action.payload[j].start),
            end: new Date(action.payload[j].end),
            title: action.payload[j].title,
            _id: action.payload[j]._id,
            attendees: action.payload[j].attendees.length,
            classId: action.payload[j].classid
          });
        }
      }
      // console.log('matchevents are: ', matchevents);
      return matchevents;
    default:
      return state;
  }
}
