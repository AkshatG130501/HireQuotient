import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['Available', 'Busy'],
        default: 'Available',
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;