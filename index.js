const { Configuration, OpenAI } = require("openai");
const readlineSync = require("readline-sync");
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' middleware
const express = require('express')
const fs = require("fs");
require("dotenv").config();
const tmp = require('tmp');
const path = require('path');
const multer = require("multer");

const app = express();
const port =  process.env.PORT || 4000;
// Set up a storage strategy for multer
// Configure Multer to save uploaded files to a specific folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, 'audio.wav'); // Specify the file name
    },
});
const upload = multer({ storage });

// Use the 'cors' middleware to enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
app.post('/api/rhyme', async (req, res) => {
    const {note} = req.body;
    const ans = await createRhyme(note);
    console.log('Received note from the frontend:', ans);
    res.json({message: 'Note saved successfully on the backend.', generatedText: ans});
});
async function createRhyme(note) {
    try {
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt : `create a phrase that rhymes with the following. don't put quotations around it: ${note}`,
            max_tokens: 90,
        });
        console.log(completion.choices[0].text);
        return completion.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
}
app.post('/api/poem', async (req, res) => {
    const {note} = req.body;
    const ans = await createPoem(note);
    const formattedText = ans.replace(/\\n/g, '\n');
    console.log('Received note from the frontend:', formattedText);
    res.json({message: 'Note saved successfully on the backend.', generatedText: formattedText});
});
async function createPoem(note) {
    try {
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt : `create a short poem that rhymes with the following phrase: ${note}`,
            max_tokens: 150,
        });
        console.log(completion.choices[0].text);
        return completion.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
}
app.post('/api/haiku', async (req, res) => {
    const { note } = req.body;
    const ans = await createHaiku(note);
    const formattedText = ans.replace(/\\n/g, '\n');
    console.log('Received note from the frontend:', formattedText);
    res.json({
        message: 'Note saved successfully on the backend.',
        generatedText: formattedText,
    });
});
async function createHaiku(note) {
    try {
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt : `create a haiku that uses the following phrase or parts of it: ${note}`,
            max_tokens: 150,
        });
        console.log(completion.choices[0].text);
        return completion.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
}
app.post('/api/song', async (req, res) => {
    const {note} = req.body;
    const ans = await createSong(note);
    const formattedText = ans.replace(/\\n/g, '\n');
    console.log('Received note from the frontend:', formattedText);
    res.json({message: 'Note saved successfully on the backend.', generatedText: formattedText});
});
async function createSong(note) {
    try {
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt : `create a song verse from the following phrase. don't write verse or verse:, please just begin the song: ${note}`,
            max_tokens: 150,
        });
        console.log(completion.choices[0].text);
        return completion.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
}
app.post('/api/whisper',upload.single('audioFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
        }

        const ans = await whisper(req.file.path);
        console.log('Received note from the frontend:', ans);

        res.json({ message: 'Note saved successfully on the backend.', generatedText: ans });
});
async function whisper(audioFilePath) {
    try {
        console.log('EHYYYYYY ' + audioFilePath)
        const response = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: fs.createReadStream('/'+audioFilePath)
        });

        // Access the transcription from the response
        const transcription = response.text;

        // Log the transcription to the console
        console.log('Transcription:', transcription);
        return transcription
    } catch (error) {
        console.error('Error:', error);
    }
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

