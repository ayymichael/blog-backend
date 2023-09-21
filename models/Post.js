import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUrl: String,
    title: String,
    tags: {
        type: Array,
        default: [],
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
},
{
    timestamps: true,
},)

export default mongoose.model('Post', PostSchema)