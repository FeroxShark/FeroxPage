// Import necessary libraries
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create the Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load the OpenAI API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Read the instructions from the "SharkAIRules.txt" file
const instructions = fs.readFileSync('SharkAIRules.txt', 'utf8');

// Define an endpoint for chat messages
app.post('/chat', async (req, res) => {
  // Get the user's message from the request body
  const userMessage = req.body.message;

  // Create a conversation with the system message replaced by the instructions
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: instructions},
      {role: "user", content: userMessage},
    ],
    temperature: 0.9, // Control the randomness of the AI's output
    max_tokens: 256, // Limit the maximum number of tokens in the AI's output
  });

  // Get the AI's response
  const aiMessage = completion.data.choices[0].message.content;

  // Send the AI's response back to the client
  res.json({response: aiMessage});
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
