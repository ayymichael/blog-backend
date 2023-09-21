import PostModel from "../models/Post.js"

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить тэги',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find({}).populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await PostModel.findById(postId).populate('user')

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await PostModel.findByIdAndDelete(postId)

        if (!post) {
            res.status(404).json({
                message: 'Статья, которую вы хотите удалить, не найдена',
            })
        }

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось удалить статью',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            title: req.body.title,
            tags: req.body.tags.split(','),
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId,
        }, {
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            title: req.body.title,
            tags: req.body.tags.split(','),
            user: req.userId
        })

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        })
    }
}