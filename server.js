import express from 'express';
import cookieParser from 'cookie-parser';
import test from './api/test.js';
import authenticate from './api/authenticate.js';
import verifyAccess from './middlewares/verifyAccess.js';

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

app.use(cookieParser());

app.use(express.static('public', {
  extensions: ['html', 'htm'],
}));

app.get('/api/test', verifyAccess, (req, res) => {
  test(req, res);
});

// login
app.post('/api/authenticate', (req, res) => {
  authenticate(req, res);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});


