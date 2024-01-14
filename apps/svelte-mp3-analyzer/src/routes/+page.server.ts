import { type RequestEvent } from '@sveltejs/kit';
// eslint-disable-next-line n/no-missing-import
import { EXPRESS_API_BASE_URL } from '$env/static/private';

export const actions = {
  /** @type {import('./$types').RequestHandler} */
  uploadFile: async (event: RequestEvent) => {
    const body = await event.request.formData();

    const response = await fetch(`${EXPRESS_API_BASE_URL}/file-upload`, {
      method: 'post',
      body: body,
      credentials: 'same-origin',
    });
    return {
      success: true,
      data: await response.json(),
    };
  },
};
