/* middleware for vercel edge */
import {jwtVerify} from 'jose';
import { next } from '@vercel/edge';

export const config = {matcher: '/api/test'}

export default async function middleware(req) {
  const authHeader = req.headers.get('authorization');
  console.log({authHeader});

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.secret);

    try {
      const payload = await jwtVerify(token, secret);
      console.log(payload);
      next();
    } catch(err) {
      return Response.json({error: 401, message: 'Invalid token!'})
    }
  } else {
    return Response.json({error: 403, message: 'authorization header not found'})
  }
}
