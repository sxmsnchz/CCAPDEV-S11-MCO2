const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");

const collection = require("./config"); // user schema

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "orgspace-secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "public")));

// ======================
// COMMENT SCHEMA
// ======================

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  page: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("comments", commentSchema);


// ======================
// ROUTES
// ======================

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});


// ======================
// ORG PAGES (LOAD COMMENTS)
// ======================

app.get("/org1", async (req, res) => {
  const comments = await Comment.find({ page: "org1" }).populate("user");
  res.render("org1", { comments });
});

app.get("/org2", async (req, res) => {
  const comments = await Comment.find({ page: "org2" }).populate("user");
  res.render("org2", { comments });
});

app.get("/org3", async (req, res) => {
  const comments = await Comment.find({ page: "org3" }).populate("user");
  res.render("org3", { comments });
});

app.get("/org4", async (req, res) => {
  const comments = await Comment.find({ page: "org4" }).populate("user");
  res.render("org4", { comments });
});

app.get("/org5", async (req, res) => {
  const comments = await Comment.find({ page: "org5" }).populate("user");
  res.render("org5", { comments });
});


// ======================
// REVIEW PAGES
// ======================

app.get("/reviews1", (req, res) => {
  res.render("reviews1");
});

app.get("/reviews2", (req, res) => {
  res.render("reviews2");
});

app.get("/reviews3", (req, res) => {
  res.render("reviews3");
});

app.get("/reviews4", (req, res) => {
  res.render("reviews4");
});

app.get("/reviews5", (req, res) => {
  res.render("reviews5");
});


// ======================
// PROFILE PAGES
// ======================

app.get("/profile-student", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "student") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-student", { user });
  } catch (error) {
    console.error("PROFILE STUDENT ERROR:", error);
    res.status(500).send("Error loading student profile.");
  }
});

app.get("/profile-organization", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "organization") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-organization", { user });
  } catch (error) {
    console.error("PROFILE ORGANIZATION ERROR:", error);
    res.status(500).send("Error loading organization profile.");
  }
});

app.get("/profile-admin", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "admin") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-admin", { user });
  } catch (error) {
    console.error("PROFILE ADMIN ERROR:", error);
    res.status(500).send("Error loading admin profile.");
  }
});


// ======================
// REGISTER PAGE
// ======================

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      userType,
      firstName,
      lastName,
      studentId,
      college,
      orgName,
      description
    } = req.body;

    if (!email.endsWith("@dlsu.edu.ph")) {
      return res.send("Please use a valid DLSU email address.");
    }

    if (password !== confirmPassword) {
      return res.send("Passwords do not match.");
    }

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.send("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let data;

    if (userType === "student") {
      data = {
        email,
        password: hashedPassword,
        userType,
        firstName,
        lastName,
        studentId,
        college
      };
    } else if (userType === "organization") {
      data = {
        email,
        password: hashedPassword,
        userType,
        orgName,
        description
      };
    } else {
      return res.send("Invalid user type.");
    }

    await collection.create(data);

    res.redirect("/login");
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).send("Error registering user.");
  }
});


// ======================
// LOGIN
// ======================

app.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await collection.findOne({ email });

    if (!user) {
      return res.render("login", { error: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.render("login", { error: "Incorrect password." });
    }

    if (user.userType !== userType) {
      return res.render("login", { error: "User type does not match this account." });
    }

    req.session.user = {
      id: user._id,
      userType: user.userType
    };

    if (user.userType === "student") {
      return res.redirect("/profile-student");
    } else if (user.userType === "organization") {
      return res.redirect("/profile-organization");
    } else if (user.userType === "admin") {
      return res.redirect("/profile-admin");
    } else {
      return res.render("login", { error: "Invalid user type." });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.render("login", { error: "Error logging in." });
  }
});


// ======================
// ADD COMMENT
// ======================

app.post("/add-comment", async (req, res) => {

  try {

    const { text, userId, page } = req.body;

    const newComment = new Comment({
      text,
      user: userId,
      page
    });

    await newComment.save();

    res.redirect("back");

  } catch (error) {

    console.error(error);
    res.send("Error saving comment");

  }

});

// ======================
// LOGOUT
// ======================

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("LOGOUT ERROR:", error);
      return res.redirect("/");
    }

    res.redirect("/login");
  });
});

// ======================
// SERVER
// ======================

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
