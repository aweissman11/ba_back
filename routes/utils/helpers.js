const validateFields = (item, isPatch) => {

  let requiredFields = [
    'name', 'email', 'firstTime',
    'people', 'lodging', 'dogs',
    'arrival', 'events', 'chores',
    'driving', 'spots', 'songs',
    'user_name', 'user_id', 'attending'
  ];

  isPatch && requiredFields.push('rsvp_id');

  let missingProps = requiredFields.filter(prop => {
    return !Object.keys(item).includes(prop);
  });

  if (missingProps.length) {
    return {
      message: `missing required fields: ${missingProps}`,
      status: 400,
      missingProps
    };
  }


  let stringFields = [
    'name', 'email', 'dogs',
    'spots', 'user_name', 'user_id'
  ]

  let emptyProps = stringFields.filter(field => {
    return item[field].length === 0;
  });

  let attendeeFields = [
    'fullName', 'allergies'
  ];

  attendeeFields.forEach(field => {
    item.people.forEach(person => {
      if (!person[field].length) {
        emptyProps.push('Attendee ' + field);
      }
    })
  })

  let songFields = [
    'song', 'artist'
  ];

  songFields.forEach(field => {
    item.songs.forEach(song => {
      if (!song[field].length) {
        field = field === 'song' ? 'name' : field;
        emptyProps.push('Song ' + field);
      }
    })
  })

  if (emptyProps.length) {
    return {
      message: `${emptyProps} cannot be left blank`,
      status: 400,
      ok: false,
      emptyProps
    };
  }

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