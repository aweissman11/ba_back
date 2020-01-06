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
let user_id = 'test_user';
let user_name = 'Test User';

// /* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BA Back' });
});

router.post('/api/rsvp', (req, res, next) => {
  let item = req.body.Rsvp;
  item.user_id = user_id;
  item.user_name = user_name;
  item.unid = user_id + ':' + uuidv4();
  item.timestamp = Date.now().toString();

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
  item.user_id = user_id;
  item.user_name = user_name;

  docClient.put({
    TableName: tableName,
    Item: item,
    ConditionExpression: '#t = :t',
    ExpressionAttributeNames: {
      '#t': 'unid'
    },
    ExpressionAttributeValues: {
      ':t': item.unid
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

router.get('/api/rsvps', (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let params = {
    TableName: tableName,
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": user_id
    },
    Limit: limit,
    ScanIndexForward: false
  };

  let startTimestamp = req.query.start ? parseInt(req.query.start) : 0;

  if (startTimestamp > 0) {
    params.ExclusiveStartKey = {
      user_id: user_id,
      timestamp: startTimestamp
    }
  }

  docClient.query(params, (err, data) => {
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

module.exports = router;



// let blankInfo = {
//   "name": "",
//   "email": "",
//   "firstTime": false,
//   "people": [],
//   "lodging": "tent",
//   "dogs": "",
//   "arrival": "June 26, 2020",
//   "events": [],
//   "chores": [],
//   "driving": "full",
//   "spots": "",
//   "songs": []
// }