const Comment = require("../models/Comment");

// ======================
// ADD COMMENT
// ======================
async function addComment(req, res) {
    try {
        const { text, page, postId } = req.body;

        if (!req.session.user) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ error: "Not logged in" });
            }
            return res.redirect("/login");
        }

        const newComment = new Comment({
            text,
            user: req.session.user.id,
            page,
            post: postId
        });

        await newComment.save();

        // Check if request wants JSON (for AJAX calls)
        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.json({ 
                success: true, 
                comment: newComment,
                user: {
                    id: req.session.user.id,
                    name: req.session.user.firstName || req.session.user.orgName || 'User'
                }
            });
        }

        res.redirect(req.get("referer") || "/");

    } catch (error) {
        console.error(error);
        if (req.xhr || req.headers.accept?.includes('json')) {
            res.status(500).json({ error: "Error saving comment" });
        } else {
            res.send("Error saving comment");
        }
    }
}

// ======================
// EDIT COMMENT
// ======================
async function editComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(404).json({ error: "Comment not found" });
            }
            return res.send("Comment not found");
        }

        const user = req.session.user;

        if (!user) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ error: "Not logged in" });
            }
            return res.redirect("/login");
        }

        // Only owner OR admin
        if (comment.user.toString() !== user.id && user.userType !== "admin") {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(403).json({ error: "Unauthorized" });
            }
            return res.send("Unauthorized");
        }

        comment.text = req.body.text;
        await comment.save();

        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.json({ success: true, comment });
        }

        res.redirect(req.get("referer") || "/");

    } catch (error) {
        console.error(error);
        if (req.xhr || req.headers.accept?.includes('json')) {
            res.status(500).json({ error: "Error editing comment" });
        } else {
            res.send("Error editing comment");
        }
    }
}

// ======================
// DELETE COMMENT
// ======================
async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(404).json({ error: "Comment not found" });
            }
            return res.send("Comment not found");
        }

        const user = req.session.user;

        if (!user) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ error: "Not logged in" });
            }
            return res.redirect("/login");
        }

        // Only owner OR admin
        if (comment.user.toString() !== user.id && user.userType !== "admin") {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(403).json({ error: "Unauthorized" });
            }
            return res.send("Unauthorized");
        }

        await Comment.findByIdAndDelete(req.params.id);

        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.json({ success: true });
        }

        res.redirect(req.get("referer") || "/");

    } catch (error) {
        console.error(error);
        if (req.xhr || req.headers.accept?.includes('json')) {
            res.status(500).json({ error: "Error deleting comment" });
        } else {
            res.send("Error deleting comment");
        }
    }
}

module.exports = { addComment, editComment, deleteComment };