import { Router } from 'express';
import { Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

export const setupRoutes = (db: Database) => {
  // Helper to parse JSON fields
  const parseJsonFields = (row: any, fields: string[]) => {
    const newRow = { ...row };
    fields.forEach(field => {
      if (newRow[field]) {
        try {
          newRow[field] = JSON.parse(newRow[field]);
        } catch (e) {
          console.error(`Failed to parse JSON for field ${field}:`, newRow[field], e);
          newRow[field] = []; // Default to empty array on error
        }
      }
    });
    return newRow;
  };

  // Prompts Routes
  router.get('/prompts', async (req, res) => {
    try {
      const prompts = await db.all(
        `SELECT p.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = p.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = p.id) as commentCount
         FROM prompts p`
      );
      res.json(prompts.map((p: any) => parseJsonFields(p, ['tags', 'supportedInputs'])));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/prompts/:id', async (req, res) => {
    try {
      const prompt = await db.get(
        `SELECT p.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = p.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = p.id) as commentCount
         FROM prompts p WHERE p.id = ?`,
        req.params.id
      );
      if (prompt) {
        res.json(parseJsonFields(prompt, ['tags', 'supportedInputs']));
      } else {
        res.status(404).json({ message: 'Prompt not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/prompts', async (req, res) => {
    try {
      const { title, description, tags, text, category, author, isRecommended, createdAt, isPublic, supportedInputs } = req.body;
      const id = uuidv4(); // Generate a unique ID
      await db.run(
        'INSERT INTO prompts (id, title, description, tags, text, category, author, isRecommended, createdAt, isPublic, supportedInputs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, title, description, JSON.stringify(tags), text, category, author, isRecommended ? 1 : 0, createdAt, isPublic ? 1 : 0, JSON.stringify(supportedInputs)
      );
      res.status(201).json({ message: 'Prompt added', id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/prompts/:id', async (req, res) => {
    try {
      const { title, description, tags, text, category, isPublic, supportedInputs } = req.body;
      await db.run(
        'UPDATE prompts SET title = ?, description = ?, tags = ?, text = ?, category = ?, isPublic = ?, supportedInputs = ? WHERE id = ?',
        title, description, JSON.stringify(tags), text, category, isPublic ? 1 : 0, JSON.stringify(supportedInputs), req.params.id
      );
      res.json({ message: 'Prompt updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/prompts/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM prompts WHERE id = ?', req.params.id);
      await db.run('DELETE FROM attachments WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM likes WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM comments WHERE itemId = ?', req.params.id);
      res.json({ message: 'Prompt deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Agents
  router.get('/agents', async (req, res) => {
    try {
      const agents = await db.all(
        `SELECT a.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = a.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = a.id) as commentCount
         FROM agents a`
      );
      res.json(agents.map((a: any) => parseJsonFields(a, ['tags'])));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/agents/:id', async (req, res) => {
    try {
      const agent = await db.get(
        `SELECT a.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = a.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = a.id) as commentCount
         FROM agents a WHERE a.id = ?`,
        req.params.id
      );
      if (agent) {
        res.json(parseJsonFields(agent, ['tags']));
      } else {
        res.status(404).json({ message: 'Agent not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/agents', async (req, res) => {
    try {
      const { title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic } = req.body;
      const id = uuidv4(); // Generate a unique ID
      await db.run(
        'INSERT INTO agents (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, title, description, JSON.stringify(tags), systemInstruction, author, isRecommended ? 1 : 0, createdAt, isPublic ? 1 : 0
      );
      res.status(201).json({ message: 'Agent added', id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/agents/:id', async (req, res) => {
    try {
      const { title, description, tags, systemInstruction, isPublic } = req.body;
      await db.run(
        'UPDATE agents SET title = ?, description = ?, tags = ?, systemInstruction = ?, isPublic = ? WHERE id = ?',
        title, description, JSON.stringify(tags), systemInstruction, isPublic ? 1 : 0, req.params.id
      );
      res.json({ message: 'Agent updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/agents/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM agents WHERE id = ?', req.params.id);
      await db.run('DELETE FROM attachments WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM likes WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM comments WHERE itemId = ?', req.params.id);
      res.json({ message: 'Agent deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Personas Routes
  router.get('/personas', async (req, res) => {
    try {
      const personas = await db.all(
        `SELECT p.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = p.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = p.id) as commentCount
         FROM personas p`
      );
      res.json(personas.map((p: any) => parseJsonFields(p, ['tags'])));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/personas/:id', async (req, res) => {
    try {
      const persona = await db.get(
        `SELECT p.*,
                (SELECT COUNT(*) FROM likes WHERE itemId = p.id) as likeCount,
                (SELECT COUNT(*) FROM comments WHERE itemId = p.id) as commentCount
         FROM personas p WHERE p.id = ?`,
        req.params.id
      );
      if (persona) {
        res.json(parseJsonFields(persona, ['tags']));
      } else {
        res.status(404).json({ message: 'Persona not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/personas', async (req, res) => {
    try {
      const { title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic } = req.body;
      const id = uuidv4(); // Generate a unique ID
      await db.run(
        'INSERT INTO personas (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, title, description, JSON.stringify(tags), systemInstruction, author, isRecommended ? 1 : 0, createdAt, isPublic ? 1 : 0
      );
      res.status(201).json({ message: 'Persona added', id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/personas/:id', async (req, res) => {
    try {
      const { title, description, tags, systemInstruction, isPublic } = req.body;
      await db.run(
        'UPDATE personas SET title = ?, description = ?, tags = ?, systemInstruction = ?, isPublic = ? WHERE id = ?',
        title, description, JSON.stringify(tags), systemInstruction, isPublic ? 1 : 0, req.params.id
      );
      res.json({ message: 'Persona updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/personas/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM personas WHERE id = ?', req.params.id);
      await db.run('DELETE FROM attachments WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM likes WHERE itemId = ?', req.params.id);
      await db.run('DELETE FROM comments WHERE itemId = ?', req.params.id);
      res.json({ message: 'Persona deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Contexts Routes
  router.get('/contexts', async (req, res) => {
    try {
      const contexts = await db.all('SELECT * FROM contexts');
      res.json(contexts.map((c: any) => parseJsonFields(c, ['tags'])));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/contexts', async (req, res) => {
    try {
      const { title, description, content, author, tags, isPublic } = req.body;
      const id = uuidv4(); // Generate a unique ID
      await db.run(
        'INSERT INTO contexts (id, title, description, content, author, tags, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)',
        id, title, description, content, author, JSON.stringify(tags), isPublic ? 1 : 0
      );
      res.status(201).json({ message: 'Context added', id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Attachments (read-only for now, handled via parent item CRUD)
  router.get('/attachments/:itemId', async (req, res) => {
    try {
      const attachments = await db.all('SELECT * FROM attachments WHERE itemId = ?', req.params.itemId);
      res.json(attachments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Likes Routes
  router.post('/likes', async (req, res) => {
    try {
      const { itemId, userId } = req.body;
      await db.run('INSERT OR IGNORE INTO likes (itemId, userId) VALUES (?, ?)', itemId, userId);
      res.status(201).json({ message: 'Like added' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/likes', async (req, res) => {
    try {
      const { itemId, userId } = req.body;
      await db.run('DELETE FROM likes WHERE itemId = ? AND userId = ?', itemId, userId);
      res.json({ message: 'Like removed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/likes/:itemId/:userId', async (req, res) => {
    try {
      const count = await db.get('SELECT COUNT(*) as count FROM likes WHERE itemId = ? AND userId = ?', req.params.itemId, req.params.userId);
      res.json({ hasLiked: count.count > 0 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Comments Routes
  router.get('/comments/:itemId', async (req, res) => {
    try {
      const comments = await db.all('SELECT * FROM comments WHERE itemId = ? ORDER BY createdAt DESC', req.params.itemId);
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/comments', async (req, res) => {
    try {
      const { id, itemId, userId, authorName, authorAvatar, content, createdAt } = req.body;
      await db.run(
        'INSERT INTO comments (id, itemId, userId, authorName, authorAvatar, content, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        id, itemId, userId, authorName, authorAvatar, content, createdAt
      );
      res.status(201).json({ message: 'Comment added', id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/comments/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM comments WHERE id = ?', req.params.id);
      res.json({ message: 'Comment deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth
  router.post('/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();
      await db.run('INSERT INTO users (id, email, password, name, avatarUrl, role) VALUES (?, ?, ?, ?, ?, ?)', id, email, hashedPassword, name || email, `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(email)}`, 'user');
      res.status(201).json({ message: 'User registered', userId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin
  router.get('/admin/users', async (req, res) => {
    try {
      const users = await db.all('SELECT id, name, email, avatarUrl, role FROM users');
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/admin/users/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM users WHERE id = ?', req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/admin/users/:id', async (req, res) => {
    try {
      const { name, email, avatarUrl, role } = req.body;
      await db.run('UPDATE users SET name = ?, email = ?, avatarUrl = ?, role = ? WHERE id = ?', name, email, avatarUrl, role, req.params.id);
      res.json({ message: 'User updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/admin/comments', async (req, res) => {
    try {
      const comments = await db.all('SELECT * FROM comments');
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/admin/comments/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM comments WHERE id = ?', req.params.id);
      res.json({ message: 'Comment deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export const exportDbAsFile = async () => { console.warn("exportDbAsFile is deprecated. Data is now managed by the backend."); };
export const importDbFromFile = async (file: File) => { console.warn("importDbFromFile is deprecated. Data is now managed by the backend."); };


