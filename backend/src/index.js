import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';
import Project from './model/Project.js';
import { userFieldMap, artworkFieldMap } from './utils/FieldMap.js';

const app = express();
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.use(express.json());

dotenv.config();
const PORT = isNaN(parseInt(process.env.PORT)) ? 3000 : parseInt(process.env.PORT); 

const USER_FIELD_MAP_OPTION = 1;
const ARTWORK_FIELD_MAP_OPTION = 2;
class ContractEnum {
    static ERC1155WRAPPER = 'ERC1155Wrapper.sol';
    static LOCK = 'Lock.sol';
    static NOPREGO = 'NoPrego.sol';
    static NOPREGONFT = 'NoPregoNFT.sol';
    static VAULT = "0x4627faAcA6F70759669aF7C3D00292942AF68A62";
    static NOPREGONFT = "0xA8Cd0B6A4A1eA416946D668CF6B73EE5A412e4e4";
}

//web2
app.get('/', (req, res) => {
    res.send('Running API');
});

app.post("/login", async (request, response) => {
    
        const fetchedUser = await User.findOne(request.body);
        let user = (fetchedUser) ? fetchedUser : await User.create(request.body);
        let lumixApiKey = await getApiKey();
        
        if(!user.wallet) {
            user.wallet = await createWallet(lumixApiKey);
            user = await user.save();
        }
        response.status(201).send({address: user.wallet.address, userdata: user.userdata});
        try {
    } catch(error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/user", async (request, response) => {
    
        const user = await User.findOne(request.body.form_response.hidden);
            if(!user.userdata){
                user.userdata = {};
            }
            user.userdata = formatTypeformData(request, USER_FIELD_MAP_OPTION);
            await user.save();
            response.status(201).send('User successfully updated');        
            try {
        } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/artwork", async (request, response) => {
    
        const user = await User.findOne(request.body.form_response.hidden);
        if(!user.artwork){
            user.artwork = [{}];
        }
        
        const formattedValues = formatTypeformData(request, ARTWORK_FIELD_MAP_OPTION);
        
        if(formattedValues.document_upload){
            const documentUploadResponse = await deployImageIPFS(formattedValues.document_upload);
            formattedValues.document_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + documentUploadResponse.IpfsHash;
        }
        
        if(formattedValues.purchase_proof_upload){
            const purchaseProofUploadResponse = await deployImageIPFS(formattedValues.purchase_proof_upload);
            formattedValues.purchase_proof_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + purchaseProofUploadResponse.IpfsHash;
        }
        
        if(formattedValues.image_upload){
            const imageUploadResponse = await deployImageIPFS(formattedValues.image_upload);
            formattedValues.image_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + imageUploadResponse.IpfsHash;
        }
        
        if(formattedValues.fee_payment_proof_upload){
            const feePaymentProofUploadResponse = await deployImageIPFS(formattedValues.fee_payment_proof_upload);
            formattedValues.fee_payment_proof_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + feePaymentProofUploadResponse.IpfsHash;
        }

        user.artwork.push(formattedValues);
        await user.save();     
        response.status(201).send('/artwork');  
        try {
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.post('/mintNFT', async (request, response) => {
    /*sample body
    {
        "email": "lucasobragasilva@gmail.com"
    }*/
    
    const user = await User.findOne(request.body);
    const artwork = user.artwork[user.artwork.length -1];

    const walletId = user.wallet.id;
    const contractAddress = ContractEnum.NOPREGONFT;

    const to = user.wallet.address; 
    const name = artwork.object_title;
    const description = artwork.object_description;
    const image = artwork.image_upload;
    const uploadedResponse = await deployJSONIPFS(JSON.stringify(artwork));
    const properties = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/'+uploadedResponse.IpfsHash
    console.log('to:'+to+ ', name:'+name+ ', description:'+description+ ', image:'+image +', properties:'+properties);

    const apiKey = getApiKey();
    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHJvamVjdElkIjoiMGQxZWZhMWEtYzQ3Yi00MmY1LTlmNmEtN2FkNzUyZGFjMTRkIiwic2NvcGVzIjpbIlJFQURfV0FMTEVUUyIsIlJFQURfQ09OVFJBQ1RTIiwiUkVBRF9UT0tFTl9UWVBFUyIsIlJFQURfVFJBTlNBQ1RJT05TIiwiREVQTE9ZX0NPTlRSQUNUUyIsIldSSVRFX0NPTlRSQUNUUyIsIldSSVRFX0NVU1RPTV9UUkFOU0FDVElPTlMiLCJXUklURV9NSU5UUyIsIldSSVRFX01JTlRTIiwiV1JJVEVfVE9LRU5fVFlQRVMiLCJXUklURV9UUkFOU0ZFUlMiLCJXUklURV9XQUxMRVRTIiwiU0lHTl9NRVNTQUdFIl0sImlhdCI6MTcyMDY1NTQwMH0.oC8wqj7paS4bld-5fyH-_GIXXoYDktqKo06XeaHB0M8ueoeLNxgYMRSHseLYBaV4wg6qXB5o60Kp1uxI5MUz3j0rpBrvGqyEIVN9ieRehvASyrBFWK7kS1GVLlmn6lhnBPorG5UqKbjZ3_BYUiAwMYx21-pmjTgLPDZ_-AQk4MeM19KGWbH3RwJt4qHjmr4zpeYTIy9g2rW8jGpGs_zxzvHX4DRvr35sRfyTosF51SJAsTWo_tN5BDaf6U5RJVUJyuD3rcDT5JNQvplg3JP3IdJwtYrqYBaQ47nZvJbpTxZTGVHjNjOdXKz-u7UvdP02xbsLMimbXAEupSwbUb2IIyxt6ZlQtDT5MyZ_14HmRWOD8_kkP_YVfaC-KIMZtd_HZxdzOL6oDv6Zm65mNznvU4dzpag7mDSF6rlGUkLJ8xkTD1aV6aVRxtih-LoYoPU0dEhYp-WpIyRvg71UBK-jVof7tkwlF-X2URVas6Xn4NZVrbeQfVhpm74JSrHmRlC9k8pojtVJJpN_aOA_rEdojgzy9s0xn4dK8RLlsJPo6_H76d1xYvr1hAutAcaC-RMiTuFJb40IVMxIfruyN4L7xO_EPkebHzJC-gp_rUS09qMxB75U_DO1ehzs-We9I0pBQQDFZWb737oC5a4yG-facVxvtrfIue6I7EEOzALtDzU',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            walletId: walletId,
            contractAddress: contractAddress,
            operations: [
                {
                  functionSignature: "mint",
                  argumentsValues: [to, name, description, image, properties]
                }
              ]
        })
      };
      
      fetch('https://protocol-sandbox.lumx.io/v2/transactions/custom', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    response.status(201).send('/mintNFT');
    
});

app.post('/transferNFT', async (request, resposne) => {

});

app.post('/tomarEmprestimo', async (request, response) => {  
    const user = await User.findOne(request.body.email);  //email object email {email: xxx}

    const spenderLumxWalletId = user.wallet.id;
    const amount = request.body.amount;
    const approval = approveBorrow(ContractEnum.VAULT, spenderLumxWalletId, spenderAddress, contractAddress, amount);

    //autorização vault-owner
    //transferencia vault-requerente
});

app.post('/deposit', async (request, response) => {
    const apiKey = getApiKey();
    const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer'+apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            walletId: spenderLumxWalletId,
            contractAddress: contractAddress,
            operations: [
                {
                  functionSignature: "approve",
                  argumentsValues: [spenderAddress, amount.toString()]
                }
              ]
        })
    };

    body: JSON.stringify({
        walletId: spenderLumxWalletId,
        contractAddress: contractAddress,
        operations: [
            {
              functionSignature: "approve",
              argumentsValues: [spenderAddress, amount.toString()]
            }
          ]
    })
});

const approveUSDC = async (spenderLumxWalletId, spenderAddress, contractAddress, amount) => {
    const apiKey = getApiKey();
    const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer'+apiKey,
          'Content-Type': 'application/json'
        },

        
        body: JSON.stringify({
            walletId: spenderLumxWalletId,
            contractAddress: contractAddress,
            operations: [
                {
                  functionSignature: "approve",
                  argumentsValues: [spenderAddress, amount.toString()]
                }
              ]
        })
    };
      
    fetch('https://protocol-sandbox.lumx.io/v2/transactions/custom', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

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

const formatTypeformData = (request, fieldMapOption) => {
    const formattedValues = {};
    const fieldMap = fieldMapOption == 1 ? userFieldMap : artworkFieldMap;

    const fieldIdMap = new Map();
    request.body.form_response.definition.fields.forEach(field => {
        fieldIdMap.set(field.id, field.title);
    });

    request.body.form_response.answers.forEach( answer => {
        const fieldId = answer.field.id;
        const fieldTitle = fieldIdMap.get(fieldId);
        const fieldName = fieldMap[fieldTitle];

        let value;
        switch (answer.type) {
        case 'text':
            value = answer.text;
            break;
        case 'date':
            value = answer.date;
            break;
        case 'phone_number':
            value = answer.phone_number;
            break;
        case 'boolean':
            value = answer.boolean;
            break;
        case 'number':
            value = answer.number;
            break;
        case 'file_url':
            value = answer.file_url;
            break;
        case 'choice':
            value = answer.choice.label;
            break;
        default:
            value = '';
        }
        formattedValues[fieldName] = value;
    });
    return formattedValues;
}

const extractFileUrlFromHtml = (html) => {
    const match = html.match(/href="(https:\/\/[^"]+\.(pdf|jpeg|jpg|png|gif))"/);
    return match ? match[1] : null;
};

const deployJSONIPFS = async (json) => {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json',
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_API_SECRET
        }
    });
    const uploadResponse = await response.json();
    return uploadResponse;
};

const deployImageIPFS = async (url) => {
    const urlStream = await fetch(url);
    const contentType = urlStream.headers.get('content-type');

    if (contentType.startsWith('text/html')) {
        const html = await urlStream.text();
        const fileUrl = extractFileUrlFromHtml(html);
        if (!fileUrl) {
            throw new Error('Unable to find a valid file URL in the HTML content');
        }
    }

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
    return uploadResponse;
}

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