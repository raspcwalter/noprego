import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    blockExplorerUrl: {
        type: String,
        required: true
    }
});

const UserDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const ArtworkSchema = new mongoose.Schema({
    ifpsHash: {
        type: String,
        required: true
    }
});

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter user gmail"]
    },
    userdata: {
        type: UserDataSchema,
        required: false
    },
    wallet: {
        type: WalletSchema,
        required: false
    },
    artwork: {
        type: ArtworkSchema,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);

export default User;