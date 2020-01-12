const express = require('express');
const _ = require('underscore');
const request = require("request");

const uuidv4 = require('uuid/v4');
const jwtDecode = require('jwt-decode');

const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const docClient = new AWS.DynamoDB.DocumentClient();


const tableName = 'ba_rsvps';
let user_name = 'Test User';
// let user_id = 'mock-aws-generated-auth-id4'

// /* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BA Back' });
});

router.post('/api/rsvp', (req, res, next) => {
  let item = req.body.Rsvp;


  let requiredFields = [
    'name', 'email', 'firstTime',
    'people', 'lodging', 'dogs',
    'arrival', 'events', 'chores',
    'driving', 'spots', 'songs',
    'user_name', 'user_id'
  ];

  let missingProps = requiredFields.filter(prop => {
    return !Object.keys(item).includes(prop);
  });

  if (missingProps.length) {
    return res.status(400).send({
      message: `missing required fields: ${missingProps}`,
      status: 400
    });
  }

  let user_id = item.user_id

  item.rsvp_id = user_id + ':' + uuidv4();
  item.timestamp = user_id + ':' + Date.now().toString();
  item.last_updated = Date.now().toString();


  docClient.put({
    TableName: tableName,
    Item: item
  }, (err, data) => {
    if (err) {
      console.log('err :', err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      })
    } else {
      return res.status(200).send(item);
    }
  })
});

router.patch('/api/rsvp', (req, res, next) => {
  let item = req.body.Rsvp;
  item.user_name = user_name;
  item.last_updated = Date.now().toString();

  let requiredFields = [
    'name', 'email', 'firstTime',
    'people', 'lodging', 'dogs',
    'arrival', 'events', 'chores',
    'driving', 'spots', 'songs',
    'user_name', 'user_id', 'rsvp_id'
  ];

  let missingProps = requiredFields.filter(prop => {
    return !Object.keys(item).includes(prop);
  });

  if (missingProps.length) {
    return res.status(400).send({
      message: `missing required fields: ${missingProps}`,
      status: 400
    });
  }

  docClient.put({
    TableName: tableName,
    Item: item,
    ConditionExpression: '#t = :t',
    ExpressionAttributeNames: {
      '#t': 'rsvp_id'
    },
    ExpressionAttributeValues: {
      ':t': item.rsvp_id
    }
  }, (err, data) => {
    if (err) {
      console.log('err :', err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    } else {
      return res.status(200).send(item);
    }
  })
});


//  get all RSVPS
router.get('/api/rsvps', (req, res, next) => {
  let params = {
    TableName: tableName
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    } else {
      return res.status(200).send(data);
    }
  });
});


router.get('/api/rsvp/:user_id', (req, res, next) => {
  let user_id = req.params.user_id;
  let params = {
    TableName: tableName,
    IndexName: "user_id-arrival-index",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    },
    Limit: 5
  };

  docClient.query(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    } else {
      if (!_.isEmpty(data.Items)) {
        return res.status(200).send(data.Items);
      } else {
        return res.status(404).send();
      }
    }
  });
});

router.delete('/api/rsvp/:timestamp', (req, res, next) => {
  let timestamp = req.params.timestamp;

  console.log('timestamp :', timestamp);
  console.log('user_id :', user_id);

  let params = {
    TableName: tableName,
    Key: {
      user_id: user_id,
      timestamp: timestamp
    }
  };

  docClient.delete(params, (err, data) => {
    if (err) {
      console.log('err :', err);
      return res.status(err.statusCode).send({
        message: err.message,
        status: err.statusCode
      });
    } else {
      console.log('data :', data);
      return res.status(200).send({
        status: 200,
        message: `${user_id}'s rsvp has been deleted`
      });
    }
  });
});

module.exports = router;