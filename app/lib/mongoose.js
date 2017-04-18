'use strict';

const assert = require('assert');
const path = require('path');
const mongoose = require('mongoose');
const EventEmitter = require('events');
const awaitEvent = require('await-event');

module.exports = app => {
  const config = app.config.mongoose;
  // assert(config.url, '[mongoose] url is required on config');
  // app.coreLogger.info('[mongoose] connecting %s', config.url);

  // mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);

  const heartEvent = new EventEmitter();
  config.forEach((item, index) => {
    let setDefaultModel = false;
    if (index === 0) setDefaultModel = true;
    createConnectionDb(app, item.name, item.url, item.options, setDefaultModel, heartEvent);
  })

  loadModel(app);

  app.beforeStart(function* () {
    app.coreLogger.info('[mongoose] starting...');
    yield heartEvent.await('connected');
    /*
     *remove heartbeat to avoid no authentication
    const serverStatus = yield db.db.command({
      serverStatus: 1,
    });

    assert(serverStatus.ok === 1, '[mongoose] server status is not ok, please check mongodb service!');
    */
    app.coreLogger.info('[mongoose] start successfully and server status is ok');
  });
};

function loadModel(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app.mongoose,
  });
  const mongoosesDir = path.join(app.config.baseDir, 'app/mongooses');
  app.loader.loadToApp(mongoosesDir, 'mongooses', {
    inject: app.mongooses,
  });
}

function createConnectionDb(app, dbName, url, options, setDefaultModel, heartEvent) {
  const db = mongoose.createConnection(url, options);
  db.Schema = mongoose.Schema;
  if (!app.mongooses) app.mongooses = {};
  if (setDefaultModel) {
    app.mongoose = db
  };
  app.mongooses[dbName] = db;

  heartEvent.await = awaitEvent;

  db.on('error', err => {
    err.message = `[mongoose]${err.message}`;
    app.coreLogger.error(err);
  });

  db.on('disconnected', () => {
    app.coreLogger.error(`[mongoose] ${url} disconnected`);
  });

  db.on('connected', () => {
    heartEvent.emit('connected');
    app.coreLogger.info(`[mongoose] ${url} connected successfully`);
  });

  db.on('reconnected', () => {
    app.coreLogger.info(`[mongoose] ${url} reconnected successfully`);
  });
}
