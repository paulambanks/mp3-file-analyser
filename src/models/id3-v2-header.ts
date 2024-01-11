/*
* https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2.2.html
*
* ID3/file identifier      "ID3"
* ID3 version              $02 00
* ID3 flags                %xx000000
* ID3 size             4 * %0xxxxxxx
*
* A ID3v2 tag can be detected with the following pattern:
* $49 44 33 yy yy xx zz zz zz zz
* Where yy is less than $FF, xx is the ‘flags’ byte and zz is less than $80.
*
*/

// The ID3v2 tag header, which should be the first information in the file, is 10 bytes;
export const ID3_HEADER_LENGTH = 10; //

/**
 * A minimal implementation for ID3v2 to allow us to skip it!
 */
export class ID3v2Header {
  header: Buffer;

  constructor(header: Buffer) {
    this.header = header;
  }

  /*
   * The first three bytes of the tag are always “ID3” to indicate that this is an ID3 tag
   */
  get IsId3() {
    return this.header.toString('ascii', 0, 3) === 'ID3';
  }

  /**
   * The ID3v2 tag size is encoded with four bytes where the most significant bit (bit 7)
   * is set to zero in every byte, making a total of 28 bits.
   * The zeroed bits are ignored, so 257 bytes long tag is represented as $00 00 02 01.
   *
   * This property will allow us to ignore the ID3 header
   *
   * To protect ourselves we mask the bit to make sure we ignore the most significant bit (first bit)
   * Then we need to calculate the size by concatenating binaries
   */
  get Size() {
    return (
      ID3_HEADER_LENGTH +
      ((this.header.readUint8(6) & 0b0111_1111) << 21) + // 0 * 2 ^ 21 = 0
      ((this.header.readUint8(7) & 0b0111_1111) << 14) + // 0 * 2 ^ 14 = 0
      ((this.header.readUint8(8) & 0b0111_1111) << 7) + // 2 * 2 ^ 7 = 256
      ((this.header.readUint8(9) & 0b0111_1111)) // 1 * 2 ^ 0 = 1
    );
  }

  toJSON() {
    return {
      IsId3: this.IsId3,
      Size: this.Size,
    };
  }
}
