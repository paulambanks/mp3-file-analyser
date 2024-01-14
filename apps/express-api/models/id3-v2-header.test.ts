import { describe, test } from 'node:test';
import { ID3_HEADER_LENGTH, ID3v2Header } from './id3-v2-header.js';
import { expect } from 'chai';

describe('ID3 V2 Header', () => {
  test('correctly parses the ID3 header', async () => {
    const buffer = Buffer.from([ 0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x10, 0x74 ]);
    const id3 = new ID3v2Header(buffer);
    const expectedOutput = {
      IsId3: true,
      Size: 2174,
    };
    expect(id3.toJSON()).to.deep.equal(expectedOutput);
  });

  // The ID3v2 tag size is encoded with four bytes where the most significant bit (bit 7)
  // is set to zero in every byte, making a total of 28 bits.
  // The zeroed bits are ignored, so 257 bytes long tag is represented as $00 00 02 01.
  test('size is 257 bytes long if represented as $00 00 02 01', async () => {
    const buffer = Buffer.from([ 0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01 ]);
    const id3 = new ID3v2Header(buffer);
    expect(id3.Size - ID3_HEADER_LENGTH).to.equal(257);
  });
});
