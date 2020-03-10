const validateFields = (item, isPatch) => {

  let requiredFields = [
    'name', 'email', 'firstTime',
    'people', 'lodging', 'dogs',
    'arrival', 'events', 'songs',
    'user_name', 'user_id', 'attending'
  ];

  isPatch && requiredFields.push('rsvp_id');

  let missingProps = requiredFields.filter(prop => {
    return !Object.keys(item).includes(prop);
  });

  if (missingProps.length) {
    return {
      message: `Application error. Missing fields: ${missingProps.join(', ')}`,
      status: 400,
      missingProps
    };
  }

  let requiredStrings = [
    'name', 'email'
  ]

  let niceStrings = {
    name: 'Your Name',
    email: 'Email Address'
  }

  let noBlanks = []
  requiredStrings.forEach(string => {
    if (!item[string].length) {
      noBlanks.push(niceStrings[string])
    }
  })

  if (noBlanks.length) {
    return {
      message: `The following fields cannot be left blank: ${noBlanks.join(', ')}`,
      status: 400,
      noBlanks
    }
  }

  let emptySubProps = []

  let attendeeFields = [
    'fullName', 'allergies'
  ];

  let niceAttendee = {
    fullName: 'Full Name',
    allergies: 'Allergies'
  }

  attendeeFields.forEach(field => {
    item.people.forEach(person => {
      if (!person[field].length) {
        emptySubProps.push(`Attendee's ` + niceAttendee[field]);
      }
    })
  })

  let songFields = [
    'song', 'artist'
  ];

  let niceSong = {
    song: 'Title',
    artist: 'Artist'
  }

  songFields.forEach(field => {
    item.songs.forEach(song => {
      if (!song[field].length) {
        emptySubProps.push('Song ' + niceSong[field]);
      }
    })
  })

  if (emptySubProps.length) {
    return {
      message: `The following fields cannot be left blank: ${emptySubProps.join(', ')}`,
      status: 400,
      ok: false,
      emptySubProps
    };
  }

  // ==========================================
  // MAKE SURE THEY SIGN UP FOR EVENTS AND ADD ATTENDEES
  // ==========================================

  if (!item.people.length) {
    return {
      message: `No one is coming? Not even you? Please click the 'Add Attendee' button and let us know who we need to feed.`,
      status: 400,
      ok: false
    };
  }

  if (!item.events.length) {
    return {
      message: `You're really not coming to any events? Please click the 'RSVP for Events' button and let us know which ones you'll be attending.`,
      status: 400,
      ok: false
    };
  }


  // ==========================================
  // EMAIL VALIDATION
  // ==========================================
  const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  let isValidEmail = validateEmail(item.email);

  if (!isValidEmail) {
    return {
      message: `Please enter a valid email address`,
      status: 400,
      ok: false
    };
  }

  return { ok: true };

}

module.exports = validateFields;