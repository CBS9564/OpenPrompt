import initSqlJs, { Database } from 'sql.js';
import { Prompt, Agent, Persona, ContextItem, Comment, Attachment } from '../types';
import { COMMUNITY_PROMPTS, COMMUNITY_AGENTS, COMMUNITY_PERSONAS, COMMUNITY_CONTEXTS } from '../constants';

let db: Database | null = null;

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
`;

const toBase64 = (arr: Uint8Array): string => btoa(String.fromCharCode.apply(null, Array.from(arr)));
const fromBase64 = (str: string): Uint8Array => new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));

const seedData = (dbInstance: Database) => {
    COMMUNITY_PROMPTS.forEach(p => {
        dbInstance.run('INSERT INTO prompts (id, title, description, tags, text, category, author, isRecommended, createdAt, isPublic, supportedInputs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            p.id, p.title, p.description, JSON.stringify(p.tags), p.text, p.category, p.author, p.isRecommended ? 1 : 0, p.createdAt || Date.now(), p.isPublic ? 1 : 0, JSON.stringify(p.supportedInputs || [])
        ]);
    });
    COMMUNITY_AGENTS.forEach(a => {
        dbInstance.run('INSERT INTO agents (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            a.id, a.title, a.description, JSON.stringify(a.tags), a.systemInstruction, a.author, a.isRecommended ? 1 : 0, a.createdAt || Date.now(), a.isPublic ? 1 : 0
        ]);
    });
    COMMUNITY_PERSONAS.forEach(p => {
        dbInstance.run('INSERT INTO personas (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            p.id, p.title, p.description, JSON.stringify(p.tags), p.systemInstruction, p.author, p.isRecommended ? 1 : 0, p.createdAt || Date.now(), p.isPublic ? 1 : 0
        ]);
    });
    COMMUNITY_CONTEXTS.forEach(c => {
        dbInstance.run('INSERT INTO contexts (id, title, description, content, author, tags, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            c.id, c.title, c.description, c.content, c.author, JSON.stringify(c.tags), c.isPublic ? 1 : 0
        ]);
    });
};

const saveDatabase = () => {
    if (!db) return;
    try {
        const data = db.export();
        localStorage.setItem('sql-db', toBase64(data));
    } catch (e) {
        console.error("Failed to save database to localStorage:", e);
    }
};

const rowsFromSqlResult = (res: any[]) => {
    if (!res || res.length === 0) return [];
    const { columns, values } = res[0];
    return values.map(valueRow => {
        const row: { [key: string]: any } = {};
        columns.forEach((col, i) => {
            row[col] = valueRow[i];
        });
        return row;
    });
};

export const init = async () => {
    if (db) return;
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://esm.sh/sql.js@1.10.3/dist/${file}` });
        const schemaSql = DB_SCHEMA;
        
        const savedDb = localStorage.getItem('sql-db');
        
        if (savedDb) {
            let dbArray: Uint8Array;
            // Migration from old comma-separated string format to new Base64 format
            if (savedDb.includes(',')) {
                console.log("Migrating database from old format...");
                dbArray = new Uint8Array(savedDb.split(',').map(Number));
            } else {
                dbArray = fromBase64(savedDb);
            }
            db = new SQL.Database(dbArray);
        } else {
            db = new SQL.Database();
        }

        // Execute schema to create tables if they don't exist (for migration)
        db.exec(schemaSql);
        
        // Seed data only if it was a new database
        if (!savedDb) {
            console.log("Seeding new database...");
            seedData(db);
        }
        
        saveDatabase();

    } catch (e) {
        console.error("Failed to initialize database. Wiping localStorage and starting fresh.", e);
        localStorage.removeItem('sql-db');
        // This path is for when loading the DB from localStorage fails, or fetching schema fails.
        // We'll try one more time to create a fresh DB.
        try {
            const SQL = await initSqlJs({ locateFile: file => `https://esm.sh/sql.js@1.10.3/dist/${file}` });
            const schemaSql = DB_SCHEMA;
            db = new SQL.Database();
            db.exec(schemaSql);
            seedData(db);
            saveDatabase();
        } catch (retryError) {
            console.error("CRITICAL: Failed to initialize a fresh database on retry:", retryError);
        }
    }
};

const parsePrompt = (p: any): Prompt => ({
    ...p,
    tags: JSON.parse(p.tags),
    supportedInputs: JSON.parse(p.supportedInputs),
    isRecommended: p.isRecommended === 1,
    isPublic: p.isPublic === 1,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
});

const parseAgent = (a: any): Agent => ({
    ...a,
    tags: JSON.parse(a.tags),
    isRecommended: a.isRecommended === 1,
    isPublic: a.isPublic === 1,
    likeCount: a.likeCount,
    commentCount: a.commentCount,
});

const parsePersona = (p: any): Persona => ({
    ...p,
    tags: JSON.parse(p.tags),
    isRecommended: p.isRecommended === 1,
    isPublic: p.isPublic === 1,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
});

const getItemsWithCountsQuery = (tableName: string) => `
    SELECT p.*,
        (SELECT COUNT(*) FROM likes WHERE itemId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE itemId = p.id) as commentCount
    FROM ${tableName} p
`;

export const getPrompts = async (): Promise<Prompt[]> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('prompts'));
    const prompts = rowsFromSqlResult(res).map(parsePrompt);
    for (const prompt of prompts) {
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [prompt.id]);
        prompt.attachments = rowsFromSqlResult(attachmentsRes);
    }
    return prompts;
};

export const getPromptById = async (id: string): Promise<Prompt | null> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('prompts') + ' WHERE p.id = ?', [id]);
    const row = rowsFromSqlResult(res)[0];
    if (row) {
        const prompt = parsePrompt(row);
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [prompt.id]);
        prompt.attachments = rowsFromSqlResult(attachmentsRes);
        return prompt;
    }
    return null;
};

export const addPrompt = async (prompt: Prompt, attachments: Omit<Attachment, 'id' | 'itemId'>[] = []) => {
    if (!db) await init();
    try {
        db!.run('INSERT INTO prompts (id, title, description, tags, text, category, author, isRecommended, createdAt, isPublic, supportedInputs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            prompt.id, prompt.title, prompt.description, JSON.stringify(prompt.tags), prompt.text, prompt.category, prompt.author, prompt.isRecommended ? 1 : 0, prompt.createdAt, prompt.isPublic ? 1 : 0, JSON.stringify(prompt.supportedInputs || [])
        ]);
        attachments.forEach(att => {
            const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                attachmentId, prompt.id, att.name, att.type, att.mimeType, att.content
            ]);
        });
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding prompt:", e);
    }
};

export const updatePrompt = async (prompt: Prompt) => {
    if (!db) await init();
    try {
        db!.run('UPDATE prompts SET title = ?, description = ?, tags = ?, text = ?, category = ?, isPublic = ? WHERE id = ?', [
            prompt.title, prompt.description, JSON.stringify(prompt.tags), prompt.text, prompt.category, prompt.isPublic ? 1 : 0, prompt.id
        ]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [prompt.id]);
        if (prompt.attachments) {
            prompt.attachments.forEach(att => {
                const attachmentId = att.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                    attachmentId, prompt.id, att.name, att.type, att.mimeType, att.content
                ]);
            });
        }
        saveDatabase();
    } catch (e) {
        console.error("Database error while updating prompt:", e);
    }
};

export const deletePrompt = async (id: string) => {
    if (!db) await init();
    try {
        db!.run('DELETE FROM prompts WHERE id = ?', [id]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [id]);
        db!.run('DELETE FROM likes WHERE itemId = ?', [id]);
        db!.run('DELETE FROM comments WHERE itemId = ?', [id]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while deleting prompt:", e);
    }
};

export const getAgents = async (): Promise<Agent[]> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('agents'));
    const agents = rowsFromSqlResult(res).map(parseAgent);
    for (const agent of agents) {
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [agent.id]);
        agent.attachments = rowsFromSqlResult(attachmentsRes);
    }
    return agents;
};

export const getAgentById = async (id: string): Promise<Agent | null> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('agents') + ' WHERE p.id = ?', [id]);
    const row = rowsFromSqlResult(res)[0];
    if (row) {
        const agent = parseAgent(row);
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [agent.id]);
        agent.attachments = rowsFromSqlResult(attachmentsRes);
        return agent;
    }
    return null;
};

export const addAgent = async (agent: Agent, attachments: Omit<Attachment, 'id' | 'itemId'>[] = []) => {
    if (!db) await init();
    try {
        db!.run('INSERT INTO agents (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            agent.id, agent.title, agent.description, JSON.stringify(agent.tags), agent.systemInstruction, agent.author, agent.isRecommended ? 1 : 0, agent.createdAt, agent.isPublic ? 1 : 0
        ]);
        attachments.forEach(att => {
            const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                attachmentId, agent.id, att.name, att.type, att.mimeType, att.content
            ]);
        });
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding agent:", e);
    }
};

export const updateAgent = async (agent: Agent) => {
    if (!db) await init();
    try {
        db!.run('UPDATE agents SET title = ?, description = ?, tags = ?, systemInstruction = ?, isPublic = ? WHERE id = ?', [
            agent.title, agent.description, JSON.stringify(agent.tags), agent.systemInstruction, agent.isPublic ? 1 : 0, agent.id
        ]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [agent.id]);
        if (agent.attachments) {
            agent.attachments.forEach(att => {
                const attachmentId = att.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                    attachmentId, agent.id, att.name, att.type, att.mimeType, att.content
                ]);
            });
        }
        saveDatabase();
    } catch (e) {
        console.error("Database error while updating agent:", e);
    }
};

export const deleteAgent = async (id: string) => {
    if (!db) await init();
    try {
        db!.run('DELETE FROM agents WHERE id = ?', [id]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [id]);
        db!.run('DELETE FROM likes WHERE itemId = ?', [id]);
        db!.run('DELETE FROM comments WHERE itemId = ?', [id]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while deleting agent:", e);
    }
};

export const getPersonas = async (): Promise<Persona[]> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('personas'));
    const personas = rowsFromSqlResult(res).map(parsePersona);
    for (const persona of personas) {
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [persona.id]);
        persona.attachments = rowsFromSqlResult(attachmentsRes);
    }
    return personas;
};

export const getPersonaById = async (id: string): Promise<Persona | null> => {
    if (!db) await init();
    const res = db!.exec(getItemsWithCountsQuery('personas') + ' WHERE p.id = ?', [id]);
    const row = rowsFromSqlResult(res)[0];
    if (row) {
        const persona = parsePersona(row);
        const attachmentsRes = db!.exec('SELECT * FROM attachments WHERE itemId = ?', [persona.id]);
        persona.attachments = rowsFromSqlResult(attachmentsRes);
        return persona;
    }
    return null;
};

export const addPersona = async (persona: Persona, attachments: Omit<Attachment, 'id' | 'itemId'>[] = []) => {
    if (!db) await init();
    try {
        db!.run('INSERT INTO personas (id, title, description, tags, systemInstruction, author, isRecommended, createdAt, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            persona.id, persona.title, persona.description, JSON.stringify(persona.tags), persona.systemInstruction, persona.author, persona.isRecommended ? 1 : 0, persona.createdAt, persona.isPublic ? 1 : 0
        ]);
        attachments.forEach(att => {
            const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                attachmentId, persona.id, att.name, att.type, att.mimeType, att.content
            ]);
        });
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding persona:", e);
    }
};

export const updatePersona = async (persona: Persona) => {
    if (!db) await init();
    try {
        db!.run('UPDATE personas SET title = ?, description = ?, tags = ?, systemInstruction = ?, isPublic = ? WHERE id = ?', [
            persona.title, persona.description, JSON.stringify(persona.tags), persona.systemInstruction, persona.isPublic ? 1 : 0, persona.id
        ]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [persona.id]);
        if (persona.attachments) {
            persona.attachments.forEach(att => {
                const attachmentId = att.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                db!.run('INSERT INTO attachments (id, itemId, name, type, mimeType, content) VALUES (?, ?, ?, ?, ?, ?)', [
                    attachmentId, persona.id, att.name, att.type, att.mimeType, att.content
                ]);
            });
        }
        saveDatabase();
    } catch (e) {
        console.error("Database error while updating persona:", e);
    }
};

export const deletePersona = async (id: string) => {
    if (!db) await init();
    try {
        db!.run('DELETE FROM personas WHERE id = ?', [id]);
        db!.run('DELETE FROM attachments WHERE itemId = ?', [id]);
        db!.run('DELETE FROM likes WHERE itemId = ?', [id]);
        db!.run('DELETE FROM comments WHERE itemId = ?', [id]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while deleting persona:", e);
    }
};

export const getContexts = async (): Promise<ContextItem[]> => {
    if (!db) await init();
    const res = db!.exec('SELECT * FROM contexts');
    return rowsFromSqlResult(res).map((c: any) => ({
        ...c,
        tags: JSON.parse(c.tags),
        isPublic: c.isPublic === 1,
    }));
};

export const addContext = async (context: ContextItem) => {
    if (!db) await init();
    try {
        db!.run('INSERT INTO contexts (id, title, description, content, author, tags, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            context.id, context.title, context.description, context.content, context.author, JSON.stringify(context.tags), context.isPublic ? 1 : 0
        ]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding context:", e);
    }
};

// Social Features
export const getCommentsForItem = async (itemId: string): Promise<Comment[]> => {
    if (!db) await init();
    const res = db!.exec('SELECT * FROM comments WHERE itemId = ? ORDER BY createdAt DESC', [itemId]);
    return rowsFromSqlResult(res);
};

export const hasUserLikedItem = async (itemId: string, userId: string): Promise<boolean> => {
    if (!db) await init();
    const res = db!.exec('SELECT COUNT(*) FROM likes WHERE itemId = ? AND userId = ?', [itemId, userId]);
    return res[0].values[0][0] === 1;
};

export const addLike = async (itemId: string, userId: string) => {
    if (!db) await init();
    try {
        db!.run('INSERT OR IGNORE INTO likes (itemId, userId) VALUES (?, ?)', [itemId, userId]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding like:", e);
    }
};

export const removeLike = async (itemId: string, userId: string) => {
    if (!db) await init();
    try {
        db!.run('DELETE FROM likes WHERE itemId = ? AND userId = ?', [itemId, userId]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while removing like:", e);
    }
};

export const addComment = async (comment: Comment) => {
    if (!db) await init();
    try {
        db!.run('INSERT INTO comments (id, itemId, userId, authorName, authorAvatar, content, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            comment.id, comment.itemId, comment.userId, comment.authorName, comment.authorAvatar, comment.content, comment.createdAt
        ]);
        saveDatabase();
    } catch (e) {
        console.error("Database error while adding comment:", e);
    }
};