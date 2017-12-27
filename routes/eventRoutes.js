const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');
const Calendar = mongoose.model('masterCal');

module.exports = app => {
  app.get('/api/events', requireLogin, async (req, res) => {
    const courses = await User.find({ googleId: req.user.googleId }).select({
      courses: 1
    });

    const studysesh = await Calendar.find(
      { 'openstudy.attendees': req.user._id },
      function(err, the_cal) {
        if (err) console.log(err);
        if (the_cal) {
          // console.log(the_cal);
        }
      }
    );

    function filter_user(event) {
      var t = [];
      t = event.attendees.map(String);
      return t.includes(req.user._id.toString());
    }
    var sessions = [];

    for (var i = 0; i < studysesh.length; i++) {
      sessions = sessions.concat(studysesh[i].openstudy.filter(filter_user));
    }

    var events = [];

    if (sessions.length === 0) {
      events = courses;
    } else {
      events = courses.concat(sessions);
    }

    res.send(events);
  });

  //this is for the ajax request to provide the user with events during that time
  app.get('/api/matchedevents/:event', requireLogin, async (req, res, done) => {
    var eventBody = req.params.event.split(',');
    var userBody = req.user;

    var classId = eventBody[0];
    var start = eventBody[1];
    var end = eventBody[2];
    var date = eventBody[3];

    const matchEvents = await Calendar.aggregate(
      { $match: { courseID: classId } },
      { $unwind: '$openstudy' },
      {
        $match: {
          'openstudy.attendees': { $nin: [userBody._id] },
          'openstudy.start': {
            $gte: new Date(date + ' ' + start)
          },
          'openstudy.end': {
            $lte: new Date(date + ' ' + end)
          }
        }
      }
    );

    var events = [];
    for (var i in matchEvents) {
      events.push(matchEvents[i].openstudy);
    }

    console.log(events);
    if (matchEvents.length === 0) {
      res.send([]);
    } else {
      res.send(events);
    }
  });

  app.post('/api/joinevent', requireLogin, (req, res) => {
    console.log(req.body);

    Calendar.update(
      { courseID: req.body.classid, 'openstudy._id': req.body.id },
      { $push: { 'openstudy.$.attendees': req.user._id } },
      function(err, data) {
        if (err) {
          console.log(err);
        }
      }
    );
    res.send(res.user);
  });

  app.post('/api/events', requireLogin, async (req, res, done) => {
    var eventBody = req.body;
    var userBody = req.user;
    var studyevent = {
      title: eventBody.event,
      classid: eventBody.classid,
      start: new Date(eventBody.date + ' ' + eventBody.start).toISOString(),
      end: new Date(eventBody.date + ' ' + eventBody.end).toISOString(),
      // attendees: [req.user._id],
      attendees: [req.user._id]
    };

    const matchEvents = await Calendar.find({
      openstudy: {
        $elemMatch: {
          attendees: { $in: [userBody._id] },
          start: {
            $lte: new Date(eventBody.date + ' ' + eventBody.end)
          },
          end: {
            $gte: new Date(eventBody.date + ' ' + eventBody.start)
          }
        }
      }
    });

    if (matchEvents.length > 0) {
      console.log('event already within that time');
      res.send('error');
    } else {
      Calendar.findOne({
        courseID: eventBody.classid
      }).then(existingCal => {
        if (existingCal) {
          console.log('found cal');
          checkstudy(studyevent, eventBody, userBody);
          done(null, existingCal);
        } else {
          console.log('new cal');
          new Calendar({
            courseID: eventBody.classid,
            openstudy: [studyevent]
          })
            .save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
            })
            .then(cal => {
              done(null, cal);
            });
        }
      });
    }
    res.send(res.user);
  });

  app.delete('/api/delete/:id', async function(req, res) {
    // console.log(req.params.id);
    // var id = req.params.id;
    // console.log(req.params.id);

    var infoArr = req.params.id.split(',');
    var id = infoArr[0];
    var classID = infoArr[1];

    // await cleanupDB(classID);

    var removeUser = await Calendar.update(
      { 'openstudy._id': id },
      { $pull: { 'openstudy.$.attendees': req.user._id } },
      function(err, data) {
        if (err) {
          console.log(err);
        }
        console.log('done');
        Calendar.findOne({ courseID: classID }, function(err, data) {
          if (err) {
            console.log(err);
          }
          var len = data.openstudy.length;
          for (var i = 0; i <= len; i++) {
            if (String(data.openstudy[i]._id) === String(id)) {
              console.log('deleting ', data.openstudy[i]);
              if (data.openstudy[i].attendees.length === 0) {
                data.openstudy.remove(id);
                data.save();
                break;
              }
              break;
            }
          }
        });
      }
    );
    res.send(res.user);
  });

  //just incase the delete doesnt work this cleans up the course Calendar
  //checking for any event that does have any users attending and deleting them
  function cleanupDB(classID) {
    Calendar.findOne({ courseID: classID }, function(err, data) {
      if (err) {
        console.log(err);
      }
      var len = data.openstudy.length;
      for (var i = 0; i <= len; i++) {
        console.log('i is ', i);
        if (data.openstudy[i] === undefined) {
          break;
        }
        if (data.openstudy[i].attendees.length === 0) {
          data.openstudy.remove(data.openstudy[i]._id);
          data.save();
          len = data.openstudy.length;
          i = 0;
        }
      }
    });
  }

  async function checkstudy(studyevent, eventBody, userBody) {
    const matchEvents = await Calendar.find(
      {
        courseID: eventBody.classid
      },
      {
        openstudy: {
          $elemMatch: {
            attendees: { $nin: [userBody._id] },
            start: {
              $lte: new Date(eventBody.date + ' ' + eventBody.end)
            },
            end: {
              $gte: new Date(eventBody.date + ' ' + eventBody.start)
            }
          }
        }
      }
    );

    const existEvents = await Calendar.find(
      {
        courseID: eventBody.classid
      },
      {
        openstudy: {
          $elemMatch: {
            attendees: { $in: [userBody._id] },
            start: {
              $lte: new Date(eventBody.date + ' ' + eventBody.end)
            },
            end: {
              $gte: new Date(eventBody.date + ' ' + eventBody.start)
            }
          }
        }
      }
    );

    console.log('testEvents ', matchEvents);
    console.log('existEvents ', existEvents);
    // console.log('matchEvents ', matchEvents);
    // console.log('existEvents ', existEvents);

    if (
      matchEvents[0].openstudy.length === 0 &&
      existEvents[0].openstudy.length === 0
    ) {
      // append a new event into the courseID
      console.log('new event');
      Calendar.update(
        { courseID: eventBody.classid },
        { $push: { openstudy: studyevent } },
        { upsert: true },
        function(err, data) {}
      );
      return;
    } else if (
      matchEvents[0].openstudy.length === 0 &&
      existEvents[0].openstudy.length > 0
    ) {
      // already have event at that time frame
      console.log('event already exist during that time');
      return;
    } else {
      // insert into matchEvents array
      console.log('matched event');
      var id = matchEvents[0].openstudy[0]._id;

      console.log(id);

      Calendar.update(
        { courseID: eventBody.classid, 'openstudy._id': id },
        { $push: { 'openstudy.$.attendees': userBody._id } },
        function(err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      return;
    }
  }
};
