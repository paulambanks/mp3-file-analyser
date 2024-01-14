import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import { URL } from 'node:url';
import { expect } from 'chai';
import { FrameHeader } from './frame-header.js';
import { ID3v2Header } from './id3-v2-header.js';

describe('FrameHeader', () => {
  test('correctly returns values for Buffer [0xFF, 0xFB, 0xA0, 0x40]', () => {
    const headerBuffer = Buffer.from([
      0b1111_1111,
      0b1111_1011,
      0b1010_0000,
      0b0100_0000,
    ]);
    const expectedOutput = {
      IsFrameHeader: true,
      Version: 1,
      Layer: 3,
      Bitrate: 160,
      SampleRateFrequency: 44100,
      Padding: false,
      SamplesCount: 1152,
      FrameLength: 522,
    };

    const frameHeader = new FrameHeader(headerBuffer);
    expect(frameHeader.toJSON()).to.deep.equal(expectedOutput);
  });

  test('correctly asserts if a buffer is NOT a frame header', () => {
    const headerBuffer = Buffer.from([
      0b1110_1111, // 0xEF
      0b1111_1011,
      0b1010_0000,
      0b0100_0000,
    ]);

    const frameHeader = new FrameHeader(headerBuffer);
    expect(frameHeader.IsFrameHeader).to.equal(false);
  });

  test('correctly return error "Invalid MP3 Version"', () => {
    const headerBuffer = Buffer.from([
      0b1111_1111,
      0b1110_1011, // incorrect version bits -> null
      0b1010_0000,
      0b0100_0000,
    ]);

    const frameHeader = new FrameHeader(headerBuffer);
    expect(() => frameHeader.toJSON()).to.throw('Invalid MP3 Version');
  });

  test('correctly return error "Invalid MP3 Layer"', () => {
    const headerBuffer = Buffer.from([
      0b1111_1111,
      0b1111_1001, // incorrect layer bits -> null
      0b1010_0000,
      0b0100_0000,
    ]);

    const frameHeader = new FrameHeader(headerBuffer);
    expect(() => frameHeader.toJSON()).to.throw('Invalid MP3 Layer');
  });

  test('correctly return error "Invalid MP3 Bitrate"', () => {
    const headerBuffer = Buffer.from([
      0b1111_1111,
      0b1111_1011,
      0b0000_0000, // incorrect bitrate (free) -> null
      0b0100_0000,
    ]);

    const frameHeader = new FrameHeader(headerBuffer);
    expect(() => frameHeader.toJSON()).to.throw(`Invalid MP3 Bitrate: 0`);
  });

  test('correctly return error "Invalid MP3 Sampling Rate Frequency"', () => {
    const headerBuffer = Buffer.from([
      0b1111_1111,
      0b1111_1011,
      0b1010_1100, // incorrect Sampling Rate Frequency (free) -> null
      0b0100_0000,
    ]);

    const frameHeader = new FrameHeader(headerBuffer);
    expect(() => frameHeader.toJSON()).to.throw(`Invalid MP3 Sampling Rate Frequency`);
  });

  test('correctly parses the sample.mp3', async () => {
    const fileURL = new URL('../fixtures/sample.mp3', import.meta.url);

    const buffer = await readFile(fileURL);
    const id3 = new ID3v2Header(buffer);

    const frame1 = buffer.subarray(id3.Size);
    const expectedOutput1 = {
      IsFrameHeader: true,
      Version: 1,
      Layer: 3,
      Bitrate: 64,
      SampleRateFrequency: 44100,
      Padding: false,
      SamplesCount: 1152,
      FrameLength: 208,
    };

    const frameHeader1 = new FrameHeader(frame1);
    expect(frameHeader1.toJSON()).to.deep.equal(expectedOutput1);

    const frame2 = frame1.subarray(frameHeader1.FrameLength);
    const expectedOutput2 = {
      IsFrameHeader: true,
      Version: 1,
      Layer: 3,
      Bitrate: 32,
      SampleRateFrequency: 44100,
      Padding: false,
      SamplesCount: 1152,
      FrameLength: 104,
    };

    const frameHeader2 = new FrameHeader(frame2);
    expect(frameHeader2.toJSON()).to.deep.equal(expectedOutput2);
  });
});
