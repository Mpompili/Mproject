const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) =>
    res.json({
        msg: 'Posts Works'
    })
);

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ noPostsFound: 'No posts found' }));
});

// @route   GET api/posts/
// @desc    Get Post
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err =>
            res.status(404).json({ noPostFound: 'No post found with ID' })
        );
});

// @route   Post api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length > 0
                    ) {
                        return res.status(400).json({
                            alreadyliked: 'User already liked this post'
                        });
                    }

                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res.status(404).json({ postnotfound: 'No post fond' })
                );
        });
    }
);

// @route   Post api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    let filtered = post.likes.filter(
                        like => like.user.toString() !== req.user.id
                    );
                    if (filtered.length === post.likes.length) {
                        return res.status(400).json({
                            haventliked: 'User has not liked this post'
                        });
                    }
                    post.likes = filtered;
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res
                        .status(404)
                        .json({ postnotfound: 'No post fond', err: err })
                );
        });
    }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id) {
                        return res
                            .status(401)
                            .json({ notauthorized: 'User not authorized' });
                    }
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err =>
                    res.status(404).json({ postnotfound: 'No post fond' })
                );
        });
    }
);

// @route   POST api/posts/
// @desc    Create a new post
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });

        newPost.save().then(post => res.json(post));
    }
);

// @route   POST api/posts/comment/:id
// @desc    Create a new comment
// @access  Private

router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };
                post.comments.unshift(newComment);
                post.save().then(post => res.json(post));
            })
            .catch(err =>
                res.status(404).json({ postnotfound: 'No post found' })
            );
    }
);

// @route   DELETE api/posts/comment/:id/:commentId
// @desc    Delete a new comment
// @access  Private

router.delete(
    '/comment/:id/:commentId',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                let newComments = post.comments.filter(
                    comment =>
                        comment.id !== req.params.commentId ||
                        comment.user.id !== req.user.id
                );

                if (newComments.length === post.comments.length) {
                    return res.status(403).json({
                        notauthorized:
                            'User not authorized to delete this comment'
                    });
                }

                post.comments = newComments;

                post.save().then(post => res.json(post));
            })
            .catch(err =>
                res.status(404).json({ postnotfound: 'No post found' })
            );
    }
);

module.exports = router;
