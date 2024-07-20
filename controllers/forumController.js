const forum = require("../models/forum");

const getAllPosts = async (req, res) => {
    try {
        const posts = await forum.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
};

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await forum.getPostById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving post" });
    }
};

const createPost = async (req, res) => {
    const { title, content, account_id } = req.body;

    if (!title || !content || !account_id) {
        return res.status(400).json({ success: false, message: 'Title, content, and account ID are required' });
    }

    try {
        const createdPost = await forum.createPost({ title, content, post_date: new Date() }, account_id);
        res.status(201).json({ success: true, post_id: createdPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating post" });
    }
};

const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    try {
        const isUpdated = await forum.updatePost(postId, title, content);

        if (isUpdated) {
            res.status(200).json({ success: true, message: 'Post updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const isDeleted = await forum.deletePost(postId);

        if (isDeleted) {
            res.status(200).json({ success: true, message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
