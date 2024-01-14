import { describe, test } from 'node:test';
import { URL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { processFrameCount } from './process-frame-count.js';
import { expect } from 'chai';

describe('processFrameCount', () => {
  test('correctly process uploaded mp3 file and calculates frame count correct', async () => {
    const url = new URL('../fixtures/sample.mp3', import.meta.url);
    const buffer = await readFile(url);

    const result = processFrameCount(buffer);
    expect(result).to.equal(6090);
  });

  test('NOT an mp3 file', async () => {
    const url = new URL('../fixtures/not-mp3-file.txt', import.meta.url);
    const buffer = await readFile(url);

    expect(() => processFrameCount(buffer))
      .to.throw('Error while processing frame 1: Frame SyncWord not found');
  });
});
