import { type RequestEvent } from '@sveltejs/kit';
// eslint-disable-next-line n/no-missing-import
import { EXPRESS_API_BASE_URL } from '$env/static/private';

type Data = {
  ok: boolean;
  filename: string;
  data?: {
    frameCount: number;
  };
  error?: {
    name: string;
    message: string;
  };
};
const uploadFile = async (event: RequestEvent): Promise<Data> => {
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
      error: await response.json() as Data['error'],
    };
  }

  return {
    ok: true,
    filename: file.name,
    data: await response.json() as Data['data'],
  };
};

export const actions = {
  uploadFile,
};
