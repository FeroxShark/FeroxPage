// Import required dependencies
const express = require('express'); // Express framework for creating web applications
const { Configuration, OpenAIApi } = require('openai'); // OpenAI SDK for interacting with the OpenAI API

// Create an instance of the Express application
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // API key for OpenAI authentication
});
const openai = new OpenAIApi(configuration);

// Route for handling chat requests
app.post('/chat', async function(req, res) {
    const message = req.body.message; // Extract the message from the request body
    const chatResponse = await openai.createChatCompletion({
        model: 'gpt-4', // Name of the GPT model to use for chat
        messages: [
            {
                role: 'user', // Role of the message sender (user or assistant)
                content: message // Content of the message
            }
        ],
        temperature: 1, // Control the randomness of the output (higher values make it more random)
        max_tokens: 256, // Limit the response length to 256 tokens
        top_p: 1, // Control the diversity of the output (higher values make it more diverse)
        frequency_penalty: 0, // Adjust the penalty for repeating similar responses
        presence_penalty: 0, // Adjust the penalty for generating unlikely responses
    });

    // Send the generated response back as JSON
    res.json({
        response: chatResponse.data.choices[0].message.content
    });
});

// Start the server and listen on port 3000
app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
