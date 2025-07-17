import { Router } from 'express';
import { Database } from 'sqlite';

const router = Router();

export const setupA2ARoutes = (db: Database) => {
  router.post('/a2a', (req, res) => {
    const a2aContext = req.header('A2A-Context');
    console.log('Received A2A message with context:', a2aContext);
    console.log('Body:', req.body);

    // TODO: Implement message validation and processing for generic A2A endpoint

    res.status(200).json({ status: 'received' });
  });

  router.post('/a2a/agent-:agentId', async (req, res) => {
    const agentId = req.params.agentId;
    const a2aContext = req.header('A2A-Context');
    console.log(`Received A2A message for agent ${agentId} with context:`, a2aContext);
    console.log('Body:', req.body);

    try {
      const agent = await db.get('SELECT * FROM agents WHERE id = ?', `agent-${agentId}`);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      // TODO: Implement actual A2A agent execution logic here
      // For now, just return a success message with agent details
      res.status(200).json({ 
        status: 'received', 
        message: `Message received by agent ${agent.title}`, 
        agent: { id: agent.id, title: agent.title, a2aEndpoint: agent.a2aEndpoint }
      });

    } catch (error: any) {
      console.error('Error processing A2A agent message:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  return router;
};