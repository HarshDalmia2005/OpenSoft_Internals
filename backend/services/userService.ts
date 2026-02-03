import sql from '../db';
import { User, CreateUserDTO } from '../models/User';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await sql<User[]>`
    SELECT * FROM users 
    WHERE email = ${email}
  `;
  return users[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await sql<User[]>`
    SELECT * FROM users 
    WHERE id = ${id}
  `;
  return users[0] || null;
}

export async function createUser(userData: CreateUserDTO): Promise<User> {
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  const [user] = await sql<User[]>`
    INSERT INTO users (email, password, username)
    VALUES (${userData.email}, ${hashedPassword}, ${userData.username})
    RETURNING *
  `;
  return user;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
