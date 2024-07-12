import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors';

import fs from 'fs';
import https from 'https';

import mongoose from 'mongoose';
import User from './model/User.js';
import Project from './model/Project.js';

dotenv.config();
const app = express();
const PORT = isNaN(parseInt('process.env.PORT')) ? 3001 : parseInt('process.env.PORT'); 
let lumixApiKey;
let user;

app.use(cors());
app.use(express.json());


//web2
app.post("/login", async (request, response) => {

    lumixApiKey = await getApiKey();

    const fetchedUser = await User.findOne(request.body);
    user = (fetchedUser) ? fetchedUser : await User.create(request.body);

    if(!user.wallet) {
        user.wallet = await createWallet(lumixApiKey);
        user = await user.save();
    }
    response.status(201).send({address: user.wallet.address, userdata: user.userdata});
});

app.post("/user", async (request, response) => {
    try {
        const user = getUserByEmail(request.body.email);
        //update user (form values + wallet)
        //return wallet address
        response.status(201).send('/user');
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/artwork", async (request, response) => {
    try {
        //IFPS: create artwork hash
        user = getUserByEmail(request.body.email);
        //db: update user 
        response.status(201).send('/artwork');
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});


const getApiKey = async () => {
    const project = await Project.findOne();
    return project.apiKey;
}

const createUser = async (request) => {
    const {email} = request.body;
    const fetchedUser = await User.findOne({email});
    return (fetchedUser) ? fetchedUser : await User.create(request.body);
}

const createWallet = async (lumxApiKey) => {
    const options = {method: 'POST', headers: {Authorization: 'Bearer '+lumxApiKey}};

    try {
        const response = await fetch('https://protocol-sandbox.lumx.io/v2/wallets', options);
        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }
        return await response.json();
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }    
}

//web3


const options = {
    key: fs.readFileSync('./localhost-key.pem', 'utf8'),
    cert: fs.readFileSync('./localhost.pem', 'utf8')
};
const httpsServer = https.createServer(options, app);

mongoose.connect("mongodb+srv://lucasoliveirabs95:WAbMcqYc1MQmkVQq@cluster0.an6suf4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("MongoDB connection success");
    httpsServer.listen(PORT, () => {
        console.log("Server listening at port "+PORT);
    });
}).catch(() => {
    console.log("MongoDB connection failed")
})