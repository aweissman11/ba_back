const checkForMissingFields = (item, isPatch) => {

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


  if (emptyProps.length) {
    return {
      message: `${emptyProps} cannot be left blank`,
      status: 400,
      ok: false,
      emptyProps
    };
  }

  return { ok: true };

}

module.exports = checkForMissingFields;