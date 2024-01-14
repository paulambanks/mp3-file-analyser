import { type Handler } from 'express';
import { processFrameCount } from '../services/process-frame-count.js';
import HttpErrors from 'http-errors';

export const uploadMp3: Handler = (request, response, next) => {
  const buffer = request?.file?.buffer;
  if (buffer == null) {
    throw new HttpErrors.BadRequest('No valid MP3 data to process');
  }

  try {
    const frameCount = processFrameCount(buffer);

    if (frameCount == null) {
      throw new HttpErrors.InternalServerError('Invalid frameCount returned');
    }

    response.send({ frameCount });
  } catch (error) {
    return next(error);
  }
};
