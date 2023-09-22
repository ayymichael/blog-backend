import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors'
import fs from 'fs'
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from "./controllers/index.js";

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aymichael:Burnest1@cluster0.muhphzg.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'blog'
})
    .then(() => { console.log('db connected') })
    .catch((e) => { console.log('db error', e) })

const PORT = process.env.PORT
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdir('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll) //получения всех постов
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne) //получения 1 поста
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create) //создание поста
app.delete('/posts/:id', checkAuth, PostController.remove) //удаление поста
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update) //изменение поста



app.listen(PORT || 5000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server started on ${process.env.PORT}`)
})
