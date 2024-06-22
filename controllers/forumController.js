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
        return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post");
    }
    };

const createPost = async (req, res) => {
    const newPost = req.body;
    const accountId = req.body.account_id;

    try {
        const createdPost = await forum.createPost(newPost, accountId);
        res.status(201).json(createdPost);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating post");
    }
    };

const updatePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    const newPostData = req.body;

    try {
        const updatedPost = await forum.updatePost(postId, newPostData);
        if (!updatedPost) {
        return res.status(404).send("Post not found");
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating post");
    }
    };
const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);

    try {
        const success = await forum.deletePost(postId);
        if (!success) {
        return res.status(404).send("Post not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting post");
    }
    
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost, 
    updatePost,
    deletePost
};