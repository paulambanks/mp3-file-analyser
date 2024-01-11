import { describe, test } from 'node:test';
import { URL, fileURLToPath } from 'node:url';
import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';

describe('UploadController', () => {
  test('correctly process uploaded mp3 file and calculates frame count correct', async () => {
    const url = new URL('../fixtures/sample.mp3', import.meta.url);
    const response = await request(app)
      .post('/file-upload')
      .attach('file', fileURLToPath(url))
      .expect(200);

    expect(response.text).to.equal('{"frameCount":6090}');
  });

  test('correctly process invalid mp3 file', async () => {
    const url = new URL('../fixtures/not-mp3-file.txt', import.meta.url);
    const response = await request(app)
      .post('/file-upload')
      .attach('file', fileURLToPath(url))
      .expect(400);

    expect(JSON.parse(response.text))
      .to.deep.equal({
        name: 'BadRequestError',
        message: 'Error while processing frame 1: Invalid MP3 Version',
      });
  });
});
