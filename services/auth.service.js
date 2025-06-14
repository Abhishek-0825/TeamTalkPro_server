import { pool } from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret, expiresIn } from '../config/jwt.js';

const register = async (email, password, username, avatar = null) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (email, password, username, avatar) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, username, avatar]
  );
  return result.insertId;
};

const login = async (email, password) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: users[0].id }, secret, { expiresIn });
  return { user: users[0], token };
};

export { register, login };
