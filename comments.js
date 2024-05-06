// Create web server
// Create a new comment
// Create a new comment
router.post('/', (req, res) => {
    // Check if the user is logged in
    if (!req.user) {
        return res.status(401).send('You need to be logged in to create a comment');
    }

    // Check if the comment is valid
    if (!req.body.comment || !req.body.postId) {
        return res.status(400).send('You need to provide a comment and a postId');
    }

    // Check if the post exists
    Post.findById(req.body.postId, (err, post) => {
        if (err) {
            return res.status(500).send('There was an error finding the post');
        }

        if (!post) {
            return res.status(404).send('The post does not exist');
        }

        // Create the comment
        Comment.create({
            user: req.user._id,
            post: req.body.postId,
            text: req.body.comment
        }, (err, comment) => {
            if (err) {
                return res.status(500).send('There was an error creating the comment');
            }

            // Add the comment to the post
            post.comments.push(comment._id);
            post.save((err, post) => {
                if (err) {
                    return res.status(500).send('There was an error saving the post');
                }

                // Send the comment back to the client
                res.status(200).send(comment);
            });
        });
    });
});

// Get all comments for a post
router.get('/post/:postId', (req, res) => {
    // Check if the post exists
    Post.findById(req.params.postId, (err, post) => {
        if (err) {
            return res.status(500).send('There was an error finding the post');
        }

        if (!post) {
            return res.status(404).send('The post does not exist');
        }

        // Find all comments for the post
        Comment.find({ post: req.params.postId }, (err, comments) => {
            if (err) {
                return res.status(500).send('There was an error finding the comments');
            }

            res.status(200).send(comments);
        });
    });
});

module.exports = router;
