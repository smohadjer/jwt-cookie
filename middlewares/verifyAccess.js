/* middleware for express.js */
import {jwtVerify} from 'jose';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    const secret = new TextEncoder().encode(process.env.secret);

    try {
      const payload = await jwtVerify(token, secret);
      console.log(payload);
      next();
    } catch(err) {
      res.status(401).json({error: 401, message: 'Your token has expired!'})
    }
  } else {
    res.status(403).json({error: 403, message: 'JWT cookie not found'});
  }
}
