import {SignJWT} from 'jose';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
  const {username, password} = req.body;
  const secret = new TextEncoder().encode(process.env.secret);

  if (username === process.env.username && password === process.env.password) {
    const token = await new SignJWT({ 'username': username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1m')
      .sign(secret);
    res.json({token});
  } else {
    res.status(403).end();
  }
}
