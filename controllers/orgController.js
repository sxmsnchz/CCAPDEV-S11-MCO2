const collection = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// ======================
// HOMEPAGE
// ======================

async function getHomepage(req, res) {
    const orgs = await collection.find({ userType: "organization" });
    res.render("index", { user: req.session.user, orgs: orgs });
}

// ======================
// ORG PAGES (LOAD COMMENTS)
// ======================

async function getOrg1(req, res) {
    try {
        console.log("1. Starting getOrg1");
        
        const org = await collection.findOne({ 
            $or: [
                { email: "au@dlsu.edu.ph" },
                { orgName: "Archers for UNICEF" }
            ]
        });
        console.log("2. Org found:", org ? "yes" : "no");
        
        if (!org) {
            return res.send("Organization not found");
        }
        
        console.log("3. Fetching posts");
        const posts = await Post.find({ organization: org._id })
            .sort({ createdAt: -1 });
        console.log("4. Posts found:", posts.length);
        
        console.log("5. Fetching comments");
        const comments = await Comment.find({ page: "org1" })
            .populate("user", "firstName lastName orgName profileImage userType");
        console.log("6. Comments found:", comments.length);
        
        console.log("7. Rendering template");
        res.render("org1", { 
            user: req.session.user || null,
            posts: posts,
            comments: comments,
            org: org
        });
        console.log("8. Render complete");
        
    } catch (error) {
        console.error("ERROR in getOrg1:", error);
        res.status(500).send("Error: " + error.message);
    }
}

async function getOrg2(req, res) {
    try {
        console.log("1. Starting getOrg2");
        
        const org = await collection.findOne({ 
            $or: [
                { email: "cso@dlsu.edu.ph" },  // Fixed: cs0 → cso
                { orgName: "Council of Student Organizations" }  // Fixed: added 's' at the end
            ]
        });
        console.log("2. Org found:", org ? "yes" : "no");
        
        if (!org) {
            console.log("❌ Organization not found with email: cso@dlsu.edu.ph or name: Council of Student Organizations");
            return res.send("Organization not found");
        }
        
        console.log("3. Fetching posts");
        const posts = await Post.find({ organization: org._id })
            .sort({ createdAt: -1 });
        console.log("4. Posts found:", posts.length);
        
        console.log("5. Fetching comments");
        const comments = await Comment.find({ page: "org2" })
            .populate("user", "firstName lastName orgName profileImage userType");
        console.log("6. Comments found:", comments.length);
        
        console.log("7. Rendering template");
        res.render("org2", { 
            user: req.session.user || null,
            posts: posts,
            comments: comments,
            org: org
        });
        console.log("8. Render complete");
        
    } catch (error) {
        console.error("ERROR in getOrg2:", error);
        res.status(500).send("Error: " + error.message);
    }
}

async function getOrg3(req, res) {
    try {
        const org = await collection.findOne({ 
            $or: [
                { email: "insec@dlsu.edu.ph" },  // Update with correct email
                { orgName: "Information Security Organization" }
            ]
        });
        
        const posts = await Post.find({ organization: org._id })
            .sort({ createdAt: -1 });
            
        const comments = await Comment.find({ page: "org3" })
            .populate("user", "firstName lastName orgName profileImage userType");
            
        res.render("org3", { 
            user: req.session.user || null,
            posts: posts,
            comments: comments,
            org: org 
        });
    } catch (error) {
        console.error("ERROR in getOrg3:", error);
        res.status(500).send("Error: " + error.message);
    }
}

async function getOrg4(req, res) {
    try {
        const org = await collection.findOne({ 
            $or: [
                { email: "lscs@dlsu.edu.ph" },  // Update with correct email
                { orgName: "La Salle Computer Society" }
            ]
        });
        
        const posts = await Post.find({ organization: org._id })
            .sort({ createdAt: -1 });
            
        const comments = await Comment.find({ page: "org4" })
            .populate("user", "firstName lastName orgName profileImage userType");
            
        res.render("org4", { 
            user: req.session.user || null,
            posts: posts,
            comments: comments,
            org: org 
        });
    } catch (error) {
        console.error("ERROR in getOrg4:", error);
        res.status(500).send("Error: " + error.message);
    }
}

async function getOrg5(req, res) {
    try {
        const org = await collection.findOne({ 
            $or: [
                { email: "mofia@dlsu.edu.ph" },  // Update with correct email
                { orgName: "Management of Financial Institutions Association" }
            ]
        });
        
        const posts = await Post.find({ organization: org._id })
            .sort({ createdAt: -1 });
            
        const comments = await Comment.find({ page: "org5" })
            .populate("user", "firstName lastName orgName profileImage userType");
            
        res.render("org5", { 
            user: req.session.user || null,
            posts: posts,
            comments: comments,
            org: org 
        });
    } catch (error) {
        console.error("ERROR in getOrg5:", error);
        res.status(500).send("Error: " + error.message);
    }
}

// ======================
// DYNAMIC ORG PAGE
// ======================

async function getOrgByName(req, res) {
    try {
        const orgName = req.params.orgName;

        const org = await collection.findOne({ orgName: orgName });

        if (!org) {
            return res.send("Organization not found");
        }

        const comments = await Comment.find({ page: orgName }).populate("user");
        const postsCount = await Comment.countDocuments({ page: orgName });

        res.render("org", { org, comments, postsCount });

    } catch (error) {
        console.error(error);
        res.send("Error loading organization");
    }
}

// ======================
// POSTS COUNT
// ======================

async function getPostsCount(req, res) {
    try {
        const page = req.params.page;
        const count = await Comment.countDocuments({ page: page });
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.json({ count: 0 });
    }
}

module.exports = { getHomepage, getOrg1, getOrg2, getOrg3, getOrg4, getOrg5, getOrgByName, getPostsCount };