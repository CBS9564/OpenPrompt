import React, { useState } from 'react';
import { A2AMessage, A2ATextPart } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const A2AClient: React.FC = () => {
  const { token } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEndpoint = queryParams.get('endpoint') || 'http://localhost:3001/api/a2a';

  const [message, setMessage] = useState('');
  const [a2aEndpoint, setA2aEndpoint] = useState(initialEndpoint);

  const curlExamples = [
    {
      title: '1. Basic Text Message',
      command: `curl -X POST http://localhost:3001/api/a2a/a2a \
  -H "Content-Type: application/json" \
  -H "A2A-Context: simple-text-test" \
  -d '{\n    "role": "user",\n    "parts": [\n      {\n        "kind": "text",\n        "text": "Hello, Agent!"\n      }\n    ]\n  }'`
    },
    {
      title: '2. Message with File (Base64)',
      command: `curl -X POST http://localhost:3001/api/a2a/a2a \
  -H "Content-Type: application/json" \
  -H "A2A-Context: file-upload-test" \
  -d '{\n    "role": "user",\n    "parts": [\n      {\n        "kind": "text",\n        "text": "Please analyze this file."\n      },\n      {\n        "kind": "file",\n        "file": {\n          "mimeType": "text/plain",\n          "data": "SGVsbG8sIFdvcmxkIQ==" // "Hello, World!" in base64\n        }\n      }\n    ]\n  }'`
    },
    {
      title: '3. Invalid Message (Missing A2A-Context Header)',
      command: `curl -X POST http://localhost:3001/api/a2a/a2a \
  -H "Content-Type: application/json" \
  -d '{\n    "role": "user",\n    "parts": [\n      {\n        "kind": "text",\n        "text": "This message should be processed."\n      }\n    ]\n  }'`
    }
  ];

  const sendMessage = async () => {
    const textPart: A2ATextPart = { kind: 'text', text: message };
    const a2aMessage: A2AMessage = { role: 'user', parts: [textPart] };

    try {
      const response = await fetch(a2aEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'A2A-Context': 'test-context',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(a2aMessage)
      });

      const data = await response.json();
      console.log('A2A response:', data);
    } catch (error) {
      console.error('Error sending A2A message:', error);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-primary mb-4">A2A Protocol Testing</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">A2A Message Sender</h2>
          <p className="text-secondary mb-4">Use this form to send a message to the A2A endpoint from the UI.</p>
          <div className="mb-4">
            <label htmlFor="a2a-endpoint" className="block text-sm font-medium text-primary mb-2">A2A Endpoint</label>
            <input
              id="a2a-endpoint"
              type="text"
              className="w-full p-3 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={a2aEndpoint}
              onChange={(e) => setA2aEndpoint(e.target.value)}
              placeholder="http://localhost:3001/api/a2a"
            />
          </div>
          <textarea
            className="w-full p-3 bg-background border border-border rounded-md text-primary mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            placeholder="Enter your A2A message here..."
          />
          <button
            onClick={sendMessage}
            className="w-full px-4 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors"
          >
            Send Message
          </button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Direct API Testing with cURL</h2>
          <p className="text-secondary mb-4">Use these commands to test the endpoint directly from your terminal.</p>
          <div className="space-y-6">
            {curlExamples.map((example, index) => (
              <div key={index}>
                <h3 className="font-semibold text-primary mb-2">{example.title}</h3>
                <pre className="bg-background p-4 rounded-md text-sm overflow-x-auto"><code>{example.command}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default A2AClient;