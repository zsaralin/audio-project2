const { Configuration, OpenAI } = require("openai");
const readlineSync = require("readline-sync");
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' middleware
const express = require('express')
require("dotenv").config();
const app = express();
const port =  process.env.PORT || 4000;

// Configure CORS to allow requests from a specific frontend domain
const corsOptions = {
    origin: 'https://speech-to-text-z027.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
};

// Use the 'cors' middleware to enable CORS for all routes
app.use(cors(corsOptions));

app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
app.post('https://speech-to-text-back.onrender.com/api/save-note', async (req, res) => {
    const {note} = req.body;

    // Here, you can save the 'note' to your desired storage or perform any other action.
    // For example, you can save it to a database.
    // Replace this with your actual logic.
    const ans = await note//runCompletion(note);

    // Log the result
    console.log('Received note from the frontend:', ans);

    // Respond with the result in the JSON response
    res.json({message: 'Note saved successfully on the backend.', generatedText: ans});
});
async function runCompletion(note) {
    try {
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt : `create 3 phrases of similar length that rhyme with the following: ${note}`,
            max_tokens: 90,
        });
        console.log(completion.choices[0].text);
        return completion.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// runCompletion();