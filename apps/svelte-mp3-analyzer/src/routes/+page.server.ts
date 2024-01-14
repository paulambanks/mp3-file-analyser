import { type RequestHandler } from '@sveltejs/kit';
// eslint-disable-next-line n/no-missing-import
import { EXPRESS_API_BASE_URL } from '$env/static/private';

const uploadFile: RequestHandler = async (event) => {
  const body = await event.request.formData();
  const file = body.get('file') as File;

  const response = await fetch(
    `${EXPRESS_API_BASE_URL}/file-upload`,
    {
      method: 'post',
      body: body,
      credentials: 'same-origin',
    },
  );

  if (response.status >= 400) {
    return {
      ok: false,
      filename: file.name,
      ...await response.json(),
    };
  }

  return {
    ok: true,
    filename: file.name,
    ...await response.json(),
  };
};

export const actions = {
  uploadFile,
};
