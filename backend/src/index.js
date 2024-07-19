import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';
import Project from './model/Project.js';
import Contract from './model/Contract.js';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = isNaN(parseInt(process.env.PORT)) ? 3000 : parseInt(process.env.PORT); 

class ContractEnum {
    static ERC1155WRAPPER = 'ERC1155Wrapper.sol';
    static LOCK = 'Lock.sol';
    static NOPREGO = 'NoPrego.sol';
    static NOPREGONFT = 'NoPregoNFT.sol';
}

//web2
app.get('/', (req, res) => {
    res.send('Running API');
});

app.post("/login", async (request, response) => {
    try {
        const fetchedUser = await User.findOne(request.body);
        let user = (fetchedUser) ? fetchedUser : await User.create(request.body);
        let lumixApiKey = await getApiKey();
        
        if(!user.wallet) {
            user.wallet = await createWallet(lumixApiKey);
            user = await user.save();
        }
        response.status(201).send({address: user.wallet.address});
    } catch(error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/user", async (request, response) => {
    try {
        const user = await User.findOne(request.body.form_response.hidden);
        if(!user.userdata){
            user.userdata = {};
        }
        user.userdata = formatTypeformData(request);
        await user.save();
        response.status(201).send('User successfully updated');
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/artwork", async (request, response) => {
    try {
        const user = await User.findOne(request.body.form_response.hidden);
        if(!user.artwork){
            user.artwork = [{}];
        }
        
        const formattedValues = formatTypeformData(request);
        const uploadResponse = await deployImageIPFS(formattedValues.artwork_image);
        formattedValues.hash_ipfs = uploadResponse.IpfsHash;

        user.artwork.push(formattedValues);
        await user.save();     
        response.status(201).send('/artwork');
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

const getApiKey = async () => {
    const project = await Project.findOne();
    return project.apiKey;
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

const getContractAddress = async (contractName) => {
    const project = await Contract.findOne();
}

const formatTypeformData = (request) => {
    const formattedValues = {};
    request.body.form_response.answers.forEach(answer => {
        const id  = answer.field.id.replace('_field_id', '');
        const value = answer.type === 'boolean' ? answer.boolean : answer.text || answer.date || answer.number || answer.file_url;
        formattedValues[id] = value;
    });
    return formattedValues;
}

const formatJotformResponse = (request) => {
    const result = {};

    for (const key in request.body.answers) {
        const answer = request.body.answers[key];
        if (answer.name === 'upload' && answer.file && answer.file.url) {
            result[answer.name] = answer.file.url;
        } else if (answer.text) {
            result[answer.name] = answer.text;
        }
    }

    return result;
}

const deployImageIPFS = async (url) => {
    const urlStream = await fetch(url);
    const arrayBuffer = await urlStream.arrayBuffer();
    const blob = new Blob([arrayBuffer])
    const file = new File([blob], "file");
    const data = new FormData();
    data.append("file", file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        body: data,
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_API_SECRET
        }
    });
    const uploadResponse = await response.json();
    console.log(uploadResponse);

    return uploadResponse;
}


//web3

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB connection success");
    app.listen(PORT, function(err){
        if (err) console.log("Error - server not listening");
        console.log("Server listening on Port", PORT);
    })
}).catch(() => {
    console.log("MongoDB connection failed")
})