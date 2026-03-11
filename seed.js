const bcrypt = require("bcrypt");
require("./config/db"); // connect to MongoDB
const User = require("./models/User");
const Comment = require("./models/Comment");
const Review = require("./models/Review");

async function seedData() {
    try {
        console.log("Seeding users, comments and reviews...");

        await User.deleteMany({});
        await Comment.deleteMany({});
        await Review.deleteMany({});

        const password123 = await bcrypt.hash("password123", 10);
        const admin123 = await bcrypt.hash("admin123", 10);

        const users = [
            {
                email: "juan.delacruz@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "Juan",
                lastName: "Dela Cruz",
                studentId: "12345678",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "maria.santos@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "Maria",
                lastName: "Santos",
                studentId: "87654321",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "john.lim@dlsu.edu.ph",
                password: password123,
                userType: "student",
                firstName: "John",
                lastName: "Lim",
                studentId: "11223344",
                college: "College of Computer Studies",
                profileImage: "/assets/default-profile.png"
            },
            {
                email: "au@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "Archers for UNICEF",
                description: "Student volunteer organization",
                tagline: "Always for the women and children",
                president: "Cherubim Citco",
                orgType: "Volunteer Organization",
                logo: "/assets/au_logo1.png"
            },
            {
                email: "admin@orgspace.dlsu.edu.ph",
                password: admin123,
                userType: "admin", 
                firstName: "Admin",
                lastName: "User" 
            }
        ];

        await User.insertMany(users);

        const seededUsers = await User.find();

        const juan  = seededUsers.find(u => u.email === "juan.delacruz@dlsu.edu.ph");
        const maria = seededUsers.find(u => u.email === "maria.santos@dlsu.edu.ph");
        const john  = seededUsers.find(u => u.email === "john.lim@dlsu.edu.ph");
        const au    = seededUsers.find(u => u.email === "au@dlsu.edu.ph");

        await Comment.insertMany([
            // POST 1 (3 comments)
            { text: "I joined one of your outreach events last term and it was really fulfilling.", user: juan._id, page: "org1", post: "post1" },
            { text: "Love the mission of this org! Hoping to volunteer soon.", user: maria._id, page: "org1", post: "post1" },
            { text: "Thanks to everyone who participated in our last project! 💚", user: au._id, page: "org1", post: "post1" },

            // POST 2 (2 comments)
            { text: "The workshops organized here are actually really helpful.", user: john._id, page: "org1", post: "post2" },
            { text: "Glad to see more students getting involved in volunteer work.", user: au._id, page: "org1", post: "post2" },

            // POST 3 (2 comments)
            { text: "Looking forward to the next event announcement!", user: maria._id, page: "org1", post: "post3" },
            { text: "This org has such a great community.", user: juan._id, page: "org1", post: "post3" }
        ]);

        // insert the following review data
        await Review.insertMany([

            // AU
            { user: john._id,  org: "org1", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org1", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org1", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org1", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org1", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // CSO
            { user: john._id,  org: "org2", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org2", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org2", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org2", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org2", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // ISO
            { user: john._id,  org: "org3", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org3", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org3", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org3", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org3", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // LSCS
            { user: john._id,  org: "org4", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org4", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org4", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org4", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org4", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

            // MAFIA
            { user: john._id,  org: "org5", rating: 5, comment: "Most fulfilling org I've joined in DLSU!",  archived: false, createdAt: new Date("2026-02-01") },
            { user: maria._id, org: "org5", rating: 4, comment: "Super fun org!",                            archived: false, createdAt: new Date("2026-02-04") },
            { user: juan._id,  org: "org5", rating: 3, comment: "Actually, good experience overall.",        archived: false, createdAt: new Date("2026-02-10") },
            { user: juan._id,  org: "org5", rating: 2, comment: "Hmm it's okay!",                            archived: false, createdAt: new Date("2026-02-05") },
            { user: maria._id, org: "org5", rating: 1, comment: "Nevermind, they could use some improvement.", archived: false, createdAt: new Date("2026-02-15") },

        ]);

        console.log("Users, comments and reviews seeded successfully.");
        process.exit();

    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seedData();
