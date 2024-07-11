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

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter user gmail"]
    },
    wallet: {
        type: WalletSchema,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);

export default User;