```sql
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
  bio TEXT,
  website TEXT,
  github TEXT,
  role TEXT DEFAULT 'user'
);
```