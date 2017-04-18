'use strict';

module.exports = appInfo => {
  const config = {
    // 加载 errorHandler 中间件
    middleware: ['errorHandler'],

    // 只对 /api 前缀的 url 路径生效
    errorHandler: {
      match: '/api',
    },

    cors: {
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    },

    keys: appInfo.name + '_1490928873243_4696',

    mongoose: [
      {
        name: 'IMS',
        url: 'mongodb://localhost:27017/IMS',
        options: {
          promiseLibrary: Promise
        }
      }, {
        name: 'authorization',
        url: 'mongodb://localhost:27017/authorization',
        options: {
          promiseLibrary: Promise
        }
      }
    ],

    // view: {
    //   defaultViewEngine: 'ejs',
    //   mapping: {
    //     '.html': 'ejs',
    //   },
    // },

    security: {
      csrf: false,
      domainWhiteList: ['http://localhost:8080'],
    },

    io: {
      init: {}, // passed to engine.io
      namespace: {
        '/': {
          connectionMiddleware: ['auth'],
          packetMiddleware: [],
        },
      },
      // redis: {
      //   host: '127.0.0.1',
      //   port: 6379
      // }
    }
  };

  return config;
};
