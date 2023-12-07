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

      if (res.cookie) {
        setCookieExpressServer(res, token);
      } else {
        setCookieServerless(res, token);
      }
  } else {
    res.status(403).end();
  }
}


function setCookieExpressServer(res, token) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? false : true;

  // set access token in a httpOnly cookie
  res.cookie('jwt', token, {
    secure: secure,
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
  });

  res.json({message: 'token is sent in a HttpOnly cookie'});
  console.log('tokens sent cookie');
}

function setCookieServerless(res, token) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? '' : '; Secure';

  // setting token in a httpOnly cookie, we need to specify Path since we
  // want browser to send cookie when page outside /api folder is requested
  // as we also use the cookie to allow access to public/admin.html
  res.setHeader('Set-Cookie', [`jwt=${token}; HttpOnly; Path=/${secure}`]);

  res.json({message: 'token is sent in a HttpOnly cookie'});
  console.log('tokens sent cookie');
}

