const { Configuration, OpenAI } = require("openai");
const readlineSync = require("readline-sync");
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' middleware
const express = require('express')
require("dotenv").config();
const app = express();
const port = 4000;

// Use the 'cors' middleware to enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
app.post('/api/save-note', async (req, res) => {
    const {note} = req.body;

    // Here, you can save the 'note' to your desired storage or perform any other action.
    // For example, you can save it to a database.
    // Replace this with your actual logic.
    const ans = await runCompletion(note);

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