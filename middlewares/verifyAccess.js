/* middleware for express.js */
import {jwtVerify} from 'jose';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log({authHeader});

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.secret);

    try {
      const payload = await jwtVerify(token, secret);
      console.log(payload);
      next();
    } catch(err) {
      res.status(401).json({error: 401, message: 'Invalid token!'})
    }
  } else {
    res.status(403).json({error: 403, message: 'authorization header not found'});
  }
}
