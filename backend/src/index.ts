


import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setupRoutes } from './routes';
import { COMMUNITY_PROMPTS, COMMUNITY_AGENTS, COMMUNITY_PERSONAS, COMMUNITY_CONTEXTS } from './data/communityData'; // Import community data

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a strong secret in production

app.use(cors());
app.use(express.json());

let db: any;

const DB_SCHEMA = `
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL,
  supportedInputs TEXT
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  systemInstruction TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS personas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  systemInstruction TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contexts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT,
  tags TEXT,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  itemId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  mimeType TEXT,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  itemId TEXT NOT NULL,
  userId TEXT NOT NULL,
  PRIMARY KEY (itemId, userId)
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  itemId TEXT NOT NULL,
  userId TEXT NOT NULL,
  authorName TEXT NOT NULL,
  authorAvatar TEXT,
  content TEXT NOT NULL,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  avatarUrl TEXT,
  role TEXT DEFAULT 'user'
);
`;

async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, '..', 'database.db'),
    driver: sqlite3.Database,
  });
  console.log('Database connection established.');

  // Apply schema if prompts table does not exist
  const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='prompts'");
  if (!tableExists) {
    console.log('Database schema not found. Applying schema...');
    await db.exec(DB_SCHEMA);
    console.log('Database schema applied.');
  } else {
    console.log('Database schema already exists.');
  }

  // Create default admin user if not exists
  const adminExists = await db.get('SELECT 1 FROM users WHERE email = ?', 'admin@example.com');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await db.run(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      `user-${Date.now()}`,
      'admin@example.com',
      hashedPassword,
      'Admin User',
      'admin'
    );
    console.log('Default admin user created.');
  }

  // Seed community data based on environment variable if tables are empty
  const seedCommunityData = process.env.SEED_COMMUNITY_DATA !== 'false'; // Default to true
  const promptsCount = await db.get('SELECT COUNT(*) as count FROM prompts');

  if (seedCommunityData && promptsCount.count === 0) {
    console.log('Seeding community data...');
    for (const p of COMMUNITY_PROMPTS) {
      await db.run(
        'INSERT INTO prompts (id, title, description, tags, text, category, author, isRecommended, createdAt, isPublic, supportedInputs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        p.id, p.title, p.description, JSON.stringify(p.tags), p.text, p.category, p.author, p.isRecommended ? 1 : 0, p.createdAt || Date.now(), p.isPublic ? 1 : 0, JSON.stringify(p.supportedInputs || [])
      );
    }
    for (const a of COMMUNITY_AGENTS) {
      await db.run(
        'INSERT INTO agents (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        a.id, a.title, a.description, JSON.stringify(a.tags), a.systemInstruction, a.author, a.isRecommended ? 1 : 0, a.createdAt || Date.now(), a.isPublic ? 1 : 0
      );
    }
    for (const p of COMMUNITY_PERSONAS) {
      await db.run(
        'INSERT INTO personas (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        p.id, p.title, p.description, JSON.stringify(p.tags), p.systemInstruction, p.author, p.isRecommended ? 1 : 0, p.createdAt || Date.now(), p.isPublic ? 1 : 0
      );
    }
    for (const c of COMMUNITY_CONTEXTS) {
      await db.run(
        'INSERT INTO contexts (id, title, description, content, author, tags, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)',
        c.id, c.title, c.description, c.content, c.author, JSON.stringify(c.tags), c.isPublic ? 1 : 0
      );
    }
    console.log('Community data seeded.');
  }
}

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

initializeDatabase().then(() => {
  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = `user-${Date.now()}`;
      await db.run(
        'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
        userId, email, hashedPassword, name || null
      );
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Middleware to protect routes
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // No token

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user;
      next();
    });
  };

  // Admin Middleware
  const authorizeAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  };

  // Apply authentication to all API routes (except auth)
  app.use('/api', authenticateToken);

  // General API Routes
  app.use('/api', setupRoutes(db));

  // Admin API Routes
  app.get('/api/admin/users', authorizeAdmin, async (req, res) => {
    try {
      const users = await db.all('SELECT id, email, name, avatarUrl, role FROM users');
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/admin/users/:id', authorizeAdmin, async (req, res) => {
    try {
      const { name, email, avatarUrl, role } = req.body;
      await db.run(
        'UPDATE users SET name = ?, email = ?, avatarUrl = ?, role = ? WHERE id = ?',
        name, email, avatarUrl, role, req.params.id
      );
      res.json({ message: 'User updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/admin/users/:id', authorizeAdmin, async (req, res) => {
    try {
      await db.run('DELETE FROM users WHERE id = ?', req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/comments', authorizeAdmin, async (req, res) => {
    try {
      const comments = await db.all('SELECT * FROM comments');
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/admin/comments/:id', authorizeAdmin, async (req, res) => {
    try {
      await db.run('DELETE FROM comments WHERE id = ?', req.params.id);
      res.json({ message: 'Comment deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

}).catch(err => {
  console.error('Failed to initialize database:', err);
});
