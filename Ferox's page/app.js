const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async function(req, res) {
    const message = req.body.message;
    // Envía el mensaje a la API de OpenAI
    const chatResponse = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: message
            }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    // Envía la respuesta del chatbot al cliente
    res.json({
        response: chatResponse.data.choices[0].message.content
    });
});

app.listen(3000, function() {
    console.log('Servidor escuchando en el puerto 3000');
});
