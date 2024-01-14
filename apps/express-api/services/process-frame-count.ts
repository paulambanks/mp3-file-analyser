import { ID3v2Header } from '../models/id3-v2-header.js';
import { FrameHeader } from '../models/frame-header.js';
import HttpErrors from 'http-errors';

const {
  BadRequest,
  InternalServerError,
} = HttpErrors;

/**
 * @param buffer The buffer we're going to analyse
 */
export function processFrameCount(buffer: Buffer) {
  const id3v2Header = new ID3v2Header(buffer);

  let offset = id3v2Header.IsId3 ? id3v2Header.Size : 0;
  let frameCount = 0; // accumulate frame count
  let frameBuffer = buffer.subarray(offset); // starting off with a buffer offset by the size of the ID3 header

  // loop until we reach the length of the offset
  while (buffer.length > offset) {
    frameCount++;
    try {
      const frameHeader = new FrameHeader(frameBuffer);
      if (!frameHeader.IsFrameHeader) {
        throw new Error(`Frame SyncWord not found ${frameCount}`);
      }

      offset += frameHeader.FrameLength;
      frameBuffer = frameBuffer.subarray(frameHeader.FrameLength);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequest(`Error while processing frame ${frameCount}: ${error.message}`);
      }
      throw new InternalServerError(`Unknown error while processing frame, at ${frameCount}`);
    }
  }
  return frameCount;
}
