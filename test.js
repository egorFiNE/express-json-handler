'use strict';

/* eslint-disable no-undef, no-invalid-this, global-require */

const assert = require('assert').strict;
const express = require('express');
const http = require('http');

process.env.SILENCE_JSONHANDLER_ERROR = "yes"; // so that JSONHandler doesn't log errors
const JSONHandler = require('./index.js');

let PORT = 0;
let app = null;

function request(path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'localhost',
      port: PORT,
      path
    };

    let dataString = null;
    if (data) {
      dataString = JSON.stringify(data);
      options.method = 'POST';
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      };
    }


    const req = http.request(options, res => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data: rawData }));
    });

    req.on('error', error => reject(error));

    if (data) {
      req.write(dataString);
    }

    req.end();
  });
}

describe('JSONHandler test', function () {
  let server = null;

  before(() => {
    return new Promise(resolve => {
      app = express();

      app.use(express.json({ type: 'application/json' }));

      app.get('/test-success/', JSONHandler(async (req, res) => {
        return { okay: 'yes' };
      }));

      app.get('/test-direct/', JSONHandler(async (req, res) => {
        res.send("OK");
      }));

      app.get('/test-error/', JSONHandler(async (req, res) => {
        throw new Error("42");
      }));

      server = app.listen(PORT, () => {
        PORT = server.address().port;
        resolve();
      });
    });
  });

  after(() => server.close());

  it('should properly serve JSON', async () => {
    const result = await request('/test-success/');
    assert.strictEqual(result.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(result.data), { okay: 'yes' });
  });

  it('should properly return response directly', async () => {
    const result = await request('/test-direct/');
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.data, "OK");
  });

  it('should properly return error', async () => {
    const result = await request('/test-error/');
    assert.strictEqual(result.statusCode, 500);
    assert.deepStrictEqual(JSON.parse(result.data), { success: false });
  });
});
