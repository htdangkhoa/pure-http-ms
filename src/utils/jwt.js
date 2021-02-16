import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const algorithm = 'RS512';

export function sign(payload, expiresIn) {
  const keyPath = path.resolve(process.cwd(), 'keys/jwt.key');

  const secret = fs.readFileSync(keyPath, 'utf-8');

  const exp = typeof expiresIn === 'string' || typeof expiresIn === 'number' ? expiresIn : '7d';

  return jwt.sign(payload, secret, { algorithm, expiresIn: exp });
}

export function verify(token) {
  const keyPath = path.resolve(process.cwd(), 'keys/jwt.key.pub');

  const secret = fs.readFileSync(keyPath, 'utf-8');

  return jwt.verify(token, secret, { algorithms: [algorithm] });
}
