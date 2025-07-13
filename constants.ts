import { Prompt, Agent, Persona, ContextItem, LLMProvider } from './types';

export const COMMUNITY_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    title: 'Creative Story Starter',
    description: 'Generate an intriguing opening paragraph for a story based on a genre and a key object.',
    tags: ['Creative Writing', 'Storytelling', 'Fiction'],
    text: `Generate an intriguing opening paragraph for a {{genre}} story that involves a {{object}}. Make it mysterious and compelling.
    
User Input:
Genre: {{genre}}
Object: {{object}}
    
Your Story Opening:
`,
    category: 'Creative Writing',
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672531200000
  },
   {
    id: 'p_json_recipe',
    title: 'Recipe in JSON Format',
    description: 'Create a recipe in JSON format using an image description.',
    tags: ['JSON', 'Cooking', 'Vision'],
    text: `Analyze the following image description of food ingredients and generate a recipe in a valid JSON format. The JSON should include a recipe name, a list of ingredients (with quantities), and a list of instructions.

Image Description:
{{userInput}}

JSON Output:
`,
    category: 'Technical',
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1672617600000
  },
  {
    id: 'p_math_worksheet',
    title: 'Math Worksheet Generator',
    description: 'Create a set of math worksheets for teachers and parents.',
    tags: ['Education', 'Math', 'Generation'],
    text: `Create a set of 5 math problems for an elementary school worksheet on the topic of {{topic}}. The problems should be word problems appropriate for {{gradeLevel}} graders.

Topic: {{topic}}
Grade Level: {{gradeLevel}}

Worksheet Problems:
`,
    category: 'Education',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672704000000
  },
  {
    id: 'p_treasure_hunt',
    title: 'Treasure Hunt',
    description: 'Create a list of treasure hunt concepts.',
    tags: ['Creative', 'Game', 'Lifestyle'],
    text: `Generate 5 creative and fun treasure hunt concepts suitable for {{audience}} in a {{location}} setting. For each concept, provide a theme and a sample first clue.

Target Audience (e.g., kids, adults): {{audience}}
Location (e.g., backyard, city park): {{location}}
`,
    category: 'Creative Writing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672790400000
  },
  {
    id: 'p_geometry_solver',
    title: 'Geometry Problem Solver',
    description: "Solve for 'X' in a description of a geometry image.",
    tags: ['Math', 'Education', 'Logic', 'Vision'],
    text: `Based on the following description of a a geometry problem from an image, solve for the value of X. Explain your reasoning step-by-step.

Image Description:
{{userInput}}

Solution:
`,
    category: 'Education',
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1672876800000
  },
  {
    id: 'p_object_identifier',
    title: "Object Identifier",
    description: "Get a description of an object and its uses from a photo description.",
    tags: ['Vision', 'Description', 'Utility'],
    text: `From the following photo description, identify the main object. Provide a detailed description of the object and list at least 3 of its common uses.

Photo Description:
{{userInput}}

Object Analysis:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1672963200000
  },
   {
    id: 'p_list_from_image',
    title: "List Items from Image",
    description: 'Get a list of identifiable objects from a photo description.',
    tags: ['Vision', 'List', 'JSON'],
    text: `Based on the following image description, list all the identifiable objects in a JSON array format.

Image Description:
{{userInput}}

JSON Object List:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1673049600000
  },
   {
    id: 'p_blog_post_creator',
    title: "Blog Post Creator",
    description: "Generate a unique blog post from a single image's description.",
    tags: ['Creative Writing', 'Blog', 'Vision'],
    text: `Write a short, engaging blog post (around 300 words) inspired by the following image description. Give it a catchy title.

Image Description:
{{userInput}}

Blog Post:
`,
    category: 'Creative Writing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1673136000000
  },
  {
    id: 'p_sentiment_analysis',
    title: 'Sentiment Analysis',
    description: 'Analyze the sentiment of text messages (Positive, Negative, Neutral).',
    tags: ['NLP', 'Analysis', 'Text'],
    text: `Analyze the sentiment of the following text. Classify it as 'Positive', 'Negative', or 'Neutral' and provide a brief justification for your classification.

Text:
"{{userInput}}"

Sentiment Analysis:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673222400000
  },
  {
    id: 'p_next_shape',
    title: 'What Shape Comes Next?',
    description: "From a description of a series of shapes, guess which shape follows.",
    tags: ['Logic', 'Puzzle', 'Game'],
    text: `I will provide a description of a sequence of shapes. Your task is to determine the next shape in the sequence and explain the pattern.

Shape Sequence Description:
{{userInput}}

What comes next and why?
`,
    category: 'Education',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673308800000
  },
  {
    id: 'p_plant_care',
    title: 'Plant Care',
    description: "How to best care for the plant described in the image?",
    tags: ['Lifestyle', 'Gardening', 'Vision'],
    text: `Based on the following description of a houseplant, provide detailed care instructions including watering schedule, light requirements, and common issues to watch out for.

Plant Description:
{{userInput}}

Care Instructions:
`,
    category: 'Lifestyle',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1673395200000
  },
  {
    id: 'p_docker_script',
    title: 'Docker Script',
    description: 'Write a script in Docker to set up a specified environment.',
    tags: ['Technical', 'Code', 'DevOps'],
    text: `Write a complete Dockerfile to set up an environment for a web application based on the following specifications.

Specifications:
- Base Image: {{baseImage}}
- Working Directory: {{workDir}}
- Dependencies to install: {{dependencies}}
- Port to expose: {{port}}
- Command to run: {{command}}

Dockerfile:
`,
    category: 'Technical',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673481600000
  },
  {
    id: 'p_brand_extractor',
    title: 'Brand Extractor',
    description: "Extract product and brand names from a text.",
    tags: ['NLP', 'Data Processing', 'Marketing'],
    text: `Extract all product and brand names from the following text. List them in a JSON array.

Text:
"{{userInput}}"

Extracted Entities:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673568000000
  },
  {
    id: 'p_cook_helper',
    title: 'Cook Helper',
    description: "Find recipe ideas based on an image of the ingredients you have.",
    tags: ['Cooking', 'Lifestyle', 'Vision'],
    text: `I have the following ingredients, based on an image description. Suggest 3 different meal ideas I could make. For each idea, give it a name and list which of the available ingredients it would use.

Image description of ingredients:
{{userInput}}

Recipe Ideas:
`,
    category: 'Lifestyle',
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1673654400000
  },
  {
    id: 'p_game_character_brainstorm',
    title: 'Game Character Brainstorming',
    description: 'Create a character design based on a provided context.',
    tags: ['Game', 'Creative Writing', 'Design'],
    text: `Brainstorm a unique video game character concept based on the following high-level description. Provide a name, a backstory summary, and three key abilities.

Character Context:
{{userInput}}

Character Concept:
`,
    category: 'Creative Writing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673740800000
  },
  {
    id: 'p_rewrite_style',
    title: "Change Writing Style",
    description: "Change the tone and writing style of a presentation text.",
    tags: ['Writing', 'Communication', 'Marketing'],
    text: `Rewrite the following text to have a more {{tone}} tone and style, suitable for an audience of {{audience}}.

Original Text:
"{{originalText}}"

New Tone: {{tone}}
Target Audience: {{audience}}

Rewritten Text:
`,
    category: 'Creative Writing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673827200000
  },
  {
    id: 'p3',
    title: 'Code Explainer',
    description: 'Explain a block of code in simple terms, describing its purpose and functionality.',
    tags: ['Programming', 'Development', 'Education'],
    text: `Please explain the following code snippet in simple, easy-to-understand terms. What does it do? How does it work?

Code:
\`\`\`{{language}}
{{codeInput}}
\`\`\`

Explanation:
`,
    category: 'Technical',
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    supportedInputs: [],
    createdAt: 1673913600000
  },
  {
    id: 'p_audio_transcriber',
    title: 'Audio Identification',
    description: "Transcribe an audio file (described textually) with information about the speakers.",
    tags: ['Audio', 'Transcription', 'NLP'],
    text: `Based on the provided text description of an audio file, create a structured transcript. Identify different speakers (e.g., Speaker A, Speaker B) and attempt to reconstruct the dialogue.

Audio Description:
"{{userInput}}"

Transcript:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['audio'],
    createdAt: 1674000000000
  },
  {
    id: 'p_video_qa',
    title: 'Q&A on Videos',
    description: "Ask questions about the key details of a video (from its description).",
    tags: ['Video', 'Q&A', 'Analysis'],
    text: `I will provide a summary of a video and then ask a question about it. Please answer the question based *only* on the information given in the summary.

Video Summary:
"{{videoSummary}}"

Question:
"{{userQuestion}}"

Answer:
`,
    category: 'Data Processing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: ['video'],
    createdAt: 1674086400000
  },
];

export const COMMUNITY_AGENTS: Agent[] = [
  {
    id: 'a1',
    title: 'Socratic Tutor',
    description: 'Guides the user to the answer using the Socratic method instead of giving the answer directly.',
    tags: ['Education', 'Learning', 'AI Tutor'],
    systemInstruction: "You are a Socratic tutor. Your goal is to help the user learn by asking guiding questions. Never give the direct answer. Instead, respond to the user's questions with questions of your own that lead them to discover the answer for themselves.",
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    createdAt: 1672531200000
  },
  {
    id: 'a3',
    title: 'Five-Year-Old Explainer',
    description: 'Explains complex topics as if the user were a five-year-old child. Uses simple analogies.',
    tags: ['Communication', 'Simplification', 'Education'],
    systemInstruction: "You are an expert at explaining complex topics in a simple and fun way. Explain everything as if you are talking to a very curious five-year-old child. Use simple words, short sentences, and relatable analogies.",
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    createdAt: 1672617600000
  },
  {
    id: 'a_json_schema_lister',
    title: 'JSON Schema Recipe Lister',
    description: 'Create JSON code based on the schema specified by the user.',
    tags: ['JSON', 'Schema', 'Technical', 'API'],
    systemInstruction: `You are an AI assistant that strictly follows JSON schemas. The user will provide a JSON schema and a request. You must generate a JSON object that perfectly matches the schema and fulfills the user's request. Do not output anything other than the valid JSON.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1672704000000
  },
   {
    id: 'a_math_tutor',
    title: 'Math Tutor',
    description: "Gives a lesson on a mathematical subject, such as quadratic equations.",
    tags: ['Math', 'Education', 'Tutor'],
    systemInstruction: "You are a friendly and encouraging math tutor. Your goal is to explain mathematical concepts clearly and patiently. Start by explaining the concept, then provide a step-by-step example, and finally, give the user a practice problem to solve. Wait for their answer and provide gentle feedback.",
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    createdAt: 1672790400000
  },
  {
    id: 'a_unit_tester',
    title: 'Unit Test Generator',
    description: 'Add unit tests for a function in Python, Go, etc.',
    tags: ['Technical', 'Code', 'Test'],
    systemInstruction: `You are a testing expert AI. The user will provide a function in a specific programming language. Your task is to write a comprehensive suite of unit tests for that function using a common testing framework for that language (e.g., pytest for Python, Go's testing package for Go). Cover edge cases, typical inputs, and invalid inputs.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1672876800000
  },
  {
    id: 'a_travel_recommender',
    title: 'Travel Recommender',
    description: 'Convert disorganized text into structured tables and give recommendations.',
    tags: ['Data Processing', 'Structuring', 'Travel'],
    systemInstruction: `You are a travel assistant that specializes in organizing messy notes. The user will provide disorganized text about travel plans or ideas. Your job is to convert this text into a clean, structured markdown table. After creating the table, add a "Recommendations" section with 2-3 helpful suggestions based on the plans.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1672963200000
  },
  {
    id: 'a_time_complexity',
    title: 'Time Complexity Analyzer',
    description: "Identify the time complexity of a function and optimize it.",
    tags: ['Technical', 'Algorithms', 'Performance', 'Code'],
    systemInstruction: `You are a computer science professor specializing in algorithmic analysis. The user will provide a function. You must: 1. Determine the Big O time complexity and space complexity. 2. Explain your reasoning clearly. 3. If possible, provide an optimized version of the function and explain the improvements.`,
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    createdAt: 1673049600000
  },
   {
    id: 'a_opossum_search',
    title: 'Opossum Search',
    description: 'Create a simple web page based on user specifications.',
    tags: ['WebDev', 'HTML', 'Code Generation', 'Creative'],
    systemInstruction: `You are "Opossum Search," a quirky but brilliant web developer AI. Your motto is "I can build that!" When a user describes a simple webpage they want, you will generate the complete HTML and CSS code for it in a single code block. Be a little playful in your variable names but ensure the code is functional.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1673136000000
  },
   {
    id: 'a_marketing_writer',
    title: 'Marketing Writer',
    description: 'Get catchy ad copy tailored to your product and target audience.',
    tags: ['Marketing', 'Copywriting', 'Advertising'],
    systemInstruction: `You are an expert marketing copywriter. The user will provide a product name, a brief description, and a target audience. Your task is to generate 3-5 catchy ad copy variations (headlines and body text) tailored specifically to that audience and product.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1673222400000
  },
   {
    id: 'a_ml_confusion_matrix',
    title: 'ML Confusion Matrix Assistant',
    description: "Get help generating and interpreting a confusion matrix.",
    tags: ['Machine Learning', 'Data Science', 'Technical'],
    systemInstruction: `You are a Machine Learning expert assistant. The user will provide the raw numbers for a confusion matrix (True Positives, True Negatives, False Positives, False Negatives). You will: 1. Format these into a clean markdown table representing the confusion matrix. 2. Calculate and explain the key metrics: Accuracy, Precision, Recall, and F1-Score.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1673308800000
  },
  {
    id: 'a_research_assistant',
    title: 'Research Assistant',
    description: "Understand the main attributes of a research paper's methodology.",
    tags: ['Research', 'Education', 'Analysis'],
    systemInstruction: `You are a research assistant AI. The user will provide the abstract or methodology section of a research paper. Your job is to read it and extract the key attributes of the study's methodology. Present your findings as a bulleted list, including points like: Research Design, Sample Size, Data Collection Methods, and Key Variables.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1673395200000
  },
  {
    id: 'a_regex_expert',
    title: 'Regular Expression Expert',
    description: 'Convert natural language queries into regular expressions.',
    tags: ['Technical', 'Regex', 'Code'],
    systemInstruction: `You are a world-class expert in regular expressions. You can convert any natural language constraint into a valid regex pattern. The user will describe what they want to match, and you will provide the regex pattern, an explanation of how it works, and a few examples of what it would match.`,
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    createdAt: 1673481600000
  },
];

export const COMMUNITY_PERSONAS: Persona[] = [
  {
    id: 'ps1',
    title: 'Pirate Captain',
    description: 'Responds like a swashbuckling pirate captain. Aye, matey!',
    tags: ['Creative', 'Roleplay', 'Fun'],
    systemInstruction: 'You are a pirate captain named "Calico" Jack. You speak in pirate slang, refer to the user as "matey" or "scurvy dog", and your responses are always adventurous and a bit greedy. Your goal is to entertain and engage in character.',
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    createdAt: 1672531200000
  },
  {
    id: 'ps2',
    title: 'Stoic Philosopher',
    description: 'Offers wisdom and advice based on the principles of Stoicism.',
    tags: ['Philosophy', 'Wisdom', 'Self-Help'],
    systemInstruction: 'You are a Stoic philosopher, modeled after Marcus Aurelius and Seneca. Your tone is calm, wise, and measured. You provide advice and perspective based on principles of logic, virtue, and acceptance of what we cannot control. You often use metaphors related to nature and the human condition.',
    author: 'OpenPrompt Team',
    isPublic: true,
    createdAt: 1672617600000
  },
  {
    id: 'ps_barista_bot',
    title: 'Barista Bot',
    description: 'Order coffee-based drinks from this virtual barista.',
    tags: ['Roleplay', 'Fun', 'Bot'],
    systemInstruction: `You are "Barista Bot," a cheerful and slightly hyper-caffeinated virtual barista. Greet the user, take their coffee order, and always try to upsell them on a pastry or a larger size. Use coffee-related puns. Your responses should be enthusiastic and friendly.`,
    author: 'Google AI Studio',
    isPublic: true,
    createdAt: 1672704000000
  },
  {
    id: 'ps_santa_claus',
    title: "Santa Claus's Mailbox",
    description: 'Respond to a handwritten letter to Santa Claus on his behalf.',
    tags: ['Roleplay', 'Creative', 'Holidays'],
    systemInstruction: `You are Santa Claus. Your voice is jolly, kind, and full of warmth. The user will provide you with a child's letter. Respond to the letter in character, mentioning something specific from their letter, acknowledging their good behavior this year, and signing off with your classic "Ho ho ho!".`,
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    createdAt: 1672790400000
  },
];

export const COMMUNITY_CONTEXTS: ContextItem[] = [
    {
        id: 'ctx1',
        title: 'Project Requirement Doc',
        description: 'A sample project requirement document for building a web application.',
        content: `
PROJECT OVERVIEW
- Project Name: "Orion" Customer Feedback Portal
- Goal: To create a web application where users can submit feedback and bug reports for our products.

KEY FEATURES
1. User Authentication: Users must be able to sign up and log in.
2. Feedback Submission Form: A form with fields for title, description, category (bug, feature, suggestion), and product selection.
3. Feedback Dashboard: A view where users can see all submitted feedback, with sorting and filtering options.
4. Voting System: Users can upvote existing feedback items.
5. Admin Panel: Admins can view, manage, and change the status of feedback (e.g., "Received", "In Progress", "Completed").
        `,
        author: 'OpenPrompt Team',
        tags: ['Software', 'Example'],
        isPublic: true,
    },
    {
        id: 'ctx2',
        title: 'Shakespearean Sonnet 18',
        description: 'The full text of William Shakespeare\'s Sonnet 18.',
        content: `
Shall I compare thee to a summer’s day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer’s lease hath all too short a date;
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature’s changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow’st;
Nor shall death brag thou wander’st in his shade,
When in eternal lines to time thou grow’st:
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.
        `,
        author: 'William Shakespeare',
        tags: ['Literature', 'Poetry'],
        isPublic: true,
    }
];


export const AVAILABLE_MODELS = {
  [LLMProvider.GEMINI]: [
    'gemini-2.5-flash',
  ],
  [LLMProvider.ANTHROPIC]: [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  [LLMProvider.GROQ]: [
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
  ],
  [LLMProvider.OLLAMA]: [
    'llama3',
    'phi3',
    'mistral',
  ],
  [LLMProvider.HUGGINGFACE]: [
    'mistralai/Mistral-7B-Instruct-v0.2',
    'google/gemma-7b',
    'meta-llama/Llama-2-7b-chat-hf',
  ],
};