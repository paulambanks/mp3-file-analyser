// http://mpgedit.org/mpgedit/mpeg_format/MP3Format.html

// Exercise is concerned about MPEG V1 Layer 3 but those constants are easily available in the specs above

const VERSIONS = [ 2.5, null, 2, 1 ] as const; // MPEG Audio version ID [00, 01, 10, 11]
const LAYERS = [ null, 3, 2, 1 ] as const; // Layers

// MPEG Version 1 Bitrates
const BITRATES_V1 = [
  [ undefined, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448 ], // layer 1
  [ undefined, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384 ], // layer 2
  [ undefined, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320 ], // layer 3
] as const;

// this is only here to demonstrate extensibility as the exercise was to implement solution for the V1
const BITRATES_V2 = [
  [ undefined, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256 ], // layer 1
  [ undefined, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160 ], // layer 2
  [ undefined, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160 ], // layer 3
] as const;

// Sampling rate frequency index for MPEG files
const SAMPLING_RATES = {
  1: [ 44100, 48000, 32000 ], // MPEG 1
  2: [ 22050, 24000, 16000 ],
  2.5: [ 11025, 12000, 8000 ],
} as const;

const SAMPLES_PER_FRAME = {
  1: [ 384, 1152, 1152 ], // MPEG 1 [Layer 1, Layer 2, Layer 3]
  2: [ 384, 1152, 576 ],
  2.5: [ 384, 1152, 576 ],
} as const;

const SYNC_WORD = 0b1111_1111_1110_0000;

export class FrameHeader {
  header: Buffer;

  constructor(header: Buffer) {
    this.header = header;
  }

  /**
   * Check if the SyncWord is valid
   */
  get IsFrameHeader() {
    // the header always consist of 11 bits that are always set on; we read 16 from the buffer and by applying the
    // mask using the SYNC_WORD itself, then we match it to an expected result
    return (this.header.readUInt16BE() & SYNC_WORD) === SYNC_WORD;
  }

  get Version() {
    /*
     * the version is covered by bits 12 and 13;
     * Byte 1 eg: 0xFB
     *
     * 0b1111_1011
     * 0b1111_1011 >> 3 // 0b0001_1111
     * 0b0001_1111 & 0b0000_0011 // 0b0000_0011
     * 0b0000_0011
     *           3 -> used to map version
     */
    const bits = (this.header.readUint8(1) >> 3) & 0b11;
    const version = VERSIONS.at(bits);
    if (version == null) {
      throw new Error('Invalid MP3 Version');
    }

    return version;
  }

  get Layer() {
    /*
     * the layer is covered by bits 14 and 15;
     * Byte 1 eg: 0xFB
     *
     * 0b1111_1011
     * 0b1111_1011 >> 1 // 0b0111_1101
     * 0b0111_1101 & 0b0000_0011 // 0b0000_0001
     * 0b0000_0001
     *           1 -> used to map layer
     */
    const bits = (this.header.readUInt8(1) >> 1) & 0b11;
    const layer = LAYERS.at(bits);

    if (layer == null) {
      throw new Error('Invalid MP3 Layer');
    }

    return layer;
  }

  get Bitrate() {
    const bitrates = this.Version === 1
      ? BITRATES_V1[this.Layer - 1]
      : BITRATES_V2[this.Layer - 1];

    // for MPEG V1 Layer 3 [ undefined, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320 ]

    /*
     * the bitrate is covered by bits from 17 to 20;
     * Byte 2 eg: 0xA0
     *
     * 0b1010_0000
     * 0b1010_0000 >> 4 // 0b0000_1010
     * 0b0000_1010 & 0b0000_1111 // 0b0000_1010 -> don't need to mask, just for consistency
     * 0b0000_1010
     *          10 -> used to map bitrate
     */

    const bits = (this.header.readUInt8(2) >> 4) & 0b1111;
    const bitrate = bitrates[bits];

    if (bitrate == null) {
      throw new Error(`Invalid MP3 Bitrate: ${bits}`);
    }

    return bitrate;
  }

  get SampleRateFrequency() {
    /*
     * the sample rate frequency is covered by bits from 21 to 22;
     * Byte 2 eg: 0xA0
     *
     * 0b1010_0000
     * 0b1010_0000 >> 2 // 0b0010_1000
     * 0b0010_1000 & 0b0000_0011 // 0b0000_0000
     * 0b0000_0000
     *           0 -> used to map bitrate
     */
    const bits = (this.header.readUInt8(2) >> 2) & 0b11;

    const rate = SAMPLING_RATES[this.Version][bits];

    if (rate == null) {
      throw new Error('Invalid MP3 Sampling Rate Frequency');
    }

    return rate;
  }

  get Padding() {
    /*
     * the padding is covered by bits from 23;
     * Byte 2 eg: 0xA0
     *
     * 0b1010_0000
     * 0b1010_0000 >> 1 // 0b0101_0000
     * 0b0101_0000 & 0b0000_0001 // 0b0000_0000
     * 0b0000_0000
     *           0 -> used to map padding
     */

    const bit = (this.header.readUInt8(2) >> 1) & 0b1;

    return bit === 0b1; // 0 -> no padding, 1 -> padded frame
  }

  get SamplesCount() {
    return SAMPLES_PER_FRAME[this.Version][this.Layer - 1]; // 1152 for MPEG V1 L3
  }

  get FrameLength() {
    // For Layer 3: FrameLengthInBytes = 144 * BitRate / SampleRate + Padding

    const bitRate = this.Bitrate * 1000; // NOTE: in the spec all bitrate values are in kbps
    const sampleRate = this.SampleRateFrequency;
    const sampleCount = this.SamplesCount / 8; // bits to bytes
    const padding = this.Padding ? 1 : 0;

    return Math.floor(sampleCount * bitRate / sampleRate) + padding;
  }

  toJSON() {
    return {
      IsFrameHeader: this.IsFrameHeader,
      Version: this.Version,
      Layer: this.Layer,
      Bitrate: this.Bitrate,
      SampleRateFrequency: this.SampleRateFrequency,
      Padding: this.Padding,
      SamplesCount: this.SamplesCount,
      FrameLength: this.FrameLength,
    };
  }
}
