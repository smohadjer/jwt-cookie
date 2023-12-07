/* middleware for vercel edge */
import {jwtVerify} from 'jose';
import { RequestCookies } from '@edge-runtime/cookies'

export const config = {matcher: '/api/test'}

export default async function middleware(req) {
  const cookies = new RequestCookies(req.headers)
  const token = cookies.get('jwt')?.value;

  if (token) {
    const secret = new TextEncoder().encode(process.env.secret);

    try {
      const payload = await jwtVerify(token, secret);
      console.log(payload);
    } catch(err) {
      return Response.json(
        { error: 401, message: 'Your token has expired!' },
        { status: 401 }
      )
    }
  } else {
    return Response.json(
      { error: 403, message: 'JWT cookie not found'},
      { status: 403 }
    );
  }
}
