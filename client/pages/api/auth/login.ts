import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '../../../shared/utils/setCookie';

// Fake users data

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data from your database
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL}/auth/login`,
      { username: req?.body?.username, password: req?.body?.password }
    );
    setCookie(res, 'accessToken', response.data.access_token, {
      path: '/',
      maxAge: 2592000,
    });

    res.status(200).send(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).send('Fail');
  }
}
