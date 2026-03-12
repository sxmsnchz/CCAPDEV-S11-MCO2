const bcrypt = require("bcrypt");
require("./config/db"); // connect to MongoDB
const User = require("./models/User");
const Comment = require("./models/Comment");
const Review = require("./models/Review");
const Post = require("./models/Post");

async function seedData() {
    try {
        console.log("Seeding users, comments and reviews...");

        await User.deleteMany({});
        await Comment.deleteMany({});
        await Review.deleteMany({});
        await Post.deleteMany({});

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
                email: "cso@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "Council of Student Organizations",
                description: "Union of accredited student organizations",
                tagline: "Always for Service",
                president: "Andreia Valderrama",
                orgType: "Student Groups",
                logo: "/assets/cso.png"
            },
            {
                email: "iso@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "Information Security Organization",
                description: "Student organization focused on information security",
                tagline: "Securing the future",
                president: "President Name",
                orgType: "Professional Organization",
                logo: "/assets/ISO_Logo.jpg"
            },
            {
                email: "lscs@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "La Salle Computer Society",
                description: "The premier computer science organization",
                tagline: "Leading the way in computing",
                president: "President Name",
                orgType: "Professional Organization",
                logo: "/assets/lscs_logo.png"
            },
            {
                email: "mafia@dlsu.edu.ph",
                password: password123,
                userType: "organization",
                orgName: "Management of Financial Institutions Association",
                description: "Organization for finance students",
                tagline: "Shaping future financial leaders",
                president: "President Name",
                orgType: "Professional Organization",
                logo: "/assets/mafia_logo.png"
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
        const cso = seededUsers.find(u => u.email === "cso@dlsu.edu.ph");
        const iso = seededUsers.find(u => u.email === "iso@dlsu.edu.ph");
        const lscs = seededUsers.find(u => u.email === "lscs@dlsu.edu.ph");
        const mafia = seededUsers.find(u => u.email === "mafia@dlsu.edu.ph");

        // Create sample posts for AU
        const auPosts = [
            {
                title: "2nd General Assembly",
                content: `Let us fly beyond the ordinary! 💫 

                The crew is calling, and Archers for UNICEF is ready to welcome its AUdventurers! ⚓️ 
                Take flight beyond the familiar and step into a journey where every voice matters, every dreamer counts, and every adventure inspires. Fly into the unknown, and let purpose guide your way! 🌟 

                Join us for the 2nd General Assembly: Finding HAUme in Neverland on January 21, 2026, from 4:00 PM to 6:00 PM at Br. Andrew Gonzales Hall 1103. Explore new lands, find your new crew, and discover how your heart and ideas can shape something magical. 🧚‍♀️ 

                ✨Don't miss the adventure by pre-registering here: bit.ly/AU_2ndGA_Pre-Reg 
                Your wings are ready… It's time to find your way home! 🗺️ 

                #TimeToFly 
                #FindingHAUmeinNeverland 
                #ArchersForUNICEF

                Pub by Brent Lim 
                Caption by Giliana Intalan 
                **Walk-ins are allowed for limited slots only. 
                As per CSO-PNP Approved: OPA-03116`,
                organization: au._id,
                image: "/assets/AU_2ndGA.jpg"
            },
            {
                title: "World Children's Day",
                content: `"A person's a person, no matter how small" - Dr. Seuss🤗

                This World Children's Day, we celebrate the wonder, curiosity, and joy that children bring to our communities. 👧 Their voices, their questions, their laughter — each reminds us of the importance of nurturing safe spaces where their dreams can grow. 🌱

                Now, let us be reminded that every small voice matters, because it's their day, their rights, and their opportunity to shape the world around them. 🗣️🌎

                To know more about World Children's Day, you may visit the links below:
                🔗https://www.unicef.org/parenting/world-childrens-day-toolkit
                🔗https://www.un.org/en/observances/world-childrens-day
                🔗https://www.who.int/.../20-11-2019-world-children-s-day...
                🔗https://www.unicef.org/.../focus-children-climate-change...

                #MyDayMyRights #WorldChildrensDay #MonthlyMAUtters
                #ArchersForUNICEF
                Pub by Clara Nicdao
                Caption by Wyonna Quiambao
                As per CSO-PNP Approved: OPA-02738`,
                organization: au._id,
                image: "/assets/AU_WCD.jpg"
            },
            {
                title: "MAUgic in Motion: Unleashing the Powers Within",
                content: `Good news, guiding spirits! 🧙🏻‍♀️ 

                🌲 In the forest, an unknown power calls and reaches out to you. It's your time to guide the hands of adventurers destined to awaken their inner magic and set it in motion. 

                Take part in MAUgic in Motion: Unleashing the Powers Within, where you'll lead our young adventurers through a world of imagination, teamwork, and wonder. 💜 Help others discover the power they never knew they had. 🧚🏻‍♀️

                🕯 Be the guiding light for our young dreamers on November 22, 2025, from 10:00 AM to 12:00 PM at John Gokongwei Building, G104-105, as they journey through tales that sparkle and adventures that awaken the mAUgic within. 💫

                🪄Step forward and claim your role as a facilitator by following these steps:
                1️⃣ Prove your magical potential by filling out the Eligibility Form: bit.ly/MaMoEligibilityForms
                2️⃣ Once your eligibility is confirmed, sign up here: bit.ly/MaMo-PreRegForm
                The forest has chosen you, it's time to let your light lead the way! 🌙

                #TheMAUgicBegins #MAUgicinMotion
                #ArchersForUnicef
                Pub by Khyra Villorente
                Caption by Giliana Intalan
                As per CSO-PNP Approved: OPA-02320`,
                organization: au._id,
                image: "/assets/AU_MAUgic.jpg"
            }
        ];

        // Create sample posts for CSO (matching the original org2.ejs)
        const csoPosts = [
            {
                title: "Happy Valentine's Day!",
                content: `"𝑇𝑒𝑙𝑙 𝑚𝑒, 𝑑𝑜 𝑦𝑜𝑢 𝑓𝑒𝑒𝑙 𝑡ℎ𝑒 𝑙𝑜𝑣𝑒?" 

                Is it the fuzzy feeling in your chest? Maybe the butterflies in your stomach? 🦋 Or is it just the caffeine helping you survive the deadlines? ☕  

                This month is for all the moments, big and small, and everything in between! Watch out for the strike of Cupid’s arrows as we celebrate love in all its forms: from friends and family to partners and even you! In the middle of academics and deadlines, don't forget to pause for today and show a little extra care and love.  

                XO, your CSO family ❤  

                Publicity by: Ella Torente  
                Caption by: Dean Laborte`,
                organization: cso._id,
                image: "/assets/CSO_VAL.jpg",
                createdAt: new Date("2026-02-14")
            },
            {
                title: "Top 10 Organizations Overall in DLSU",
                content: `Integrity and excellence continue to define our community as we inaugurate the 51st year of the Council of Student Organizations. We are proud to recognize the Top 10 organizations that have exhibited exceptional merit during the Term 1, A.Y. 2025-2026 Overall Accreditation Process.

                This recognition reflects the passion, discipline, and collective effort you bring to your organizations and to the wider Lasallian community. May this milestone inspire fellow Lasallians to lead with integrity, serve with purpose, and strive for excellence. Congratulations! 

                #51stCSO 
                #AlwaysForService 
                #1CSO`,
                organization: cso._id,
                image: "/assets/CSO_TOP.jpg",
                createdAt: new Date("2026-02-07")
            },
            {
                title: "CSO Happy New Year",
                content: `Folding over the final day of the year, the Council of Student Organizations invites you to embrace the fresh start ahead.

                As we transition into January, we look forward to a new year of excellence and service, walking alongside every Lasallian in our shared pursuit of student-led growth. 

                Happy New Year! 🎇 

                #51stCSO 
                #AlwaysForService 
                #1CSO`,
                organization: cso._id,
                image: "/assets/CSO_HNY.jpg",
                createdAt: new Date("2026-01-01")
            }
        ];

        // Create sample posts for ISO
        const isoPosts = [
            {
                title: "2nd General Assembly 2026: Introduction to CTF",
                content: `2026: Introduction to CTF

                Jan 14, 1:00-2:30 PM, held online & F2F at GK105-106
                Register here: https://bit.ly/ISOIntroToCTFs

                #ISOIntroToCTF2026
                #ISO2526
                #CybersecurityCompetenceAndAwareness`,
                organization: iso._id,
                image: "/assets/ISO_CTFW.jpg",
                createdAt: new Date("2026-01-14")
            },
            {
                title: "Career Talk 2025: Securing your future",
                content: `Ready to launch your cyber career into a new galaxy?
                Discover career paths, challenges, and insider tips from industry expert AJ Malicsi at our second ever ISO Career Talk 2025: Securing Your Future.

                Nov 29, 1:00-2:20 PM, held online & open to all!
                Register here: https://forms.gle/kGBYEQwvPGzNv69i9

                #ISOCareerTalk
                #PreparingForMyInfoSecCareer
                #ISO2526
                #CybersecurityCompetenceAndAwareness`,
                organization: iso._id,
                image: "/assets/ISO_SYF.jpg",
                createdAt: new Date("2025-11-29")
            },
            {
                title: "First General Assembly",
                content: `Are you ready for the Assembly of '25?
                ISO Members! Come join us at our First General Assembly happening on November 12, 2025 at Room GK103 between 12 PM to 3PM! We'll discuss future projects, what it means to be a cybersecurity professional, and our plans for upcoming CTF Trainings! See you there!`,
                organization: iso._id,
                image: "/assets/ISO_FGA.jpg",
                createdAt: new Date("2025-11-12")
            }
        ];

        // Create sample posts for LSCS
        const lscsPosts = [
            {
                title: "Macky's Heartstrings 2026",
                content: `Macky's Heartstrings is back! Join us this February as we celebrate friendship and community within LSCS. Whether you want to send a thank-you note to a friend or just enjoy some treats, we've got something for everyone.

                Send Anonymous Letters
                Submit your messages here: https://lscs.info/MackysHS26_Letters
                Deadline: February 12, 2026

                Drop by our booth at the Gokongwei Lobby for a fun afternoon filled with activities! You can enjoy free treats like ice scramble, chocolates, and exclusive stickers, claim your printed letters, and join in on our mini-games, and photos with friends

                Booth Day: February 13, 2026
                Time: 1:15 PM - 5:00 PM
                Location: Gokongwei Lobby

                Pub by Angelo Almeda
                Caption by Dencel Pineda

                #40thLSCS
                #RubyYear
                #IgniteInnovateInspire
                #LSCS_SocioCivic
                #MackysHeartstrings

                Disclaimer: This event is subject to approval by CSO APS or SLIFE
                As per CSO-PNP Approved: OPA-03606`,
                organization: lscs._id,
                image: "/assets/LSCS_JOGACF.jpg",
                createdAt: new Date("2026-02-13")
            },
            {
                title: "Junior Officer General Assembly: Committee Fair",
                content: `Step on up, Junior Officers!

                It's the most jaw-dropping, heart-stopping, mind-bending, and greatest event of the term!

                You, our fellow JO, stumbled into a world of wonders where anything can happen! Let yourself be caught up in the endless possibilities, or COMMITTEES, that this Amazing Committee Fair has in store for you!

                Well, let's not waste any time! Let's get right into the show!

                Br. Andrew Gonzales 20th Floor MPH
                January 24, 2026 (Saturday)
                1:30 PM - 5:30 PM

                Pub by Chastine Cabatay
                Caption by Emman Punsalan and Faith Francisco

                #40thLSCS
                #RubyYear
                #IgniteInnovateInspire
                #LSCS_TND
                #JOGACommFair

                As per CSO-PNP Approved: OPA-03102`,
                organization: lscs._id,
                image: "/assets/LSCS_JOGACF.jpg",
                createdAt: new Date("2026-01-24")
            },
            {
                title: "2nd General Assembly",
                content: `Some people say that there is eternal joy, laughter, fun, and music in the Land of the Remembered, lying beyond the realm of the living and in the underworld—but what's stopping you from enjoying festivities here? 🎊💃

                It may be in your destiny to stumble upon our invitation to the 2nd General Assembly on January 21, from 2:30PM to 4:45PM. 🌟 Join us at Yuchengco Hall Y507-Y509, where stories come alive and every choice shapes how tales are told. ❤️‍🔥

                If you'd like to open the Book of Life with us, pre-register here: https://forms.gle/XZkzUfQG5RYpGedm8 📖✨

                As the new year begins to unfold, a fresh new chapter is waiting to be written. ✍️

                Pub by Chastine Cabatay
                Caption by Sarah Nicole Jallorina

                #40thLSCS
                #RubyYear
                #IgniteInnovateInspire
                #LSCS_HRD
                #2ndGeneralAssembly

                As per CSO-PNP Approved: OPA-03069`,
                organization: lscs._id,
                image: "/assets/LSCS_2NDGA.jpg",
                createdAt: new Date("2026-01-21")
            }
        ];

        // Create sample posts for MAFIA
        const mafiaPosts = [
            {
                title: "Into the Hot Seat: Quick Moves, Big FINishes",
                content: `The lights are on. The hot seat is set. Today's the day.

                The wait is officially over. Today, Into the Hot Seat: Quick Moves, Big FINishes takes center stage - bringing you face-to-face with the realities of corporate risk management. The mic is passed, the pressure is real, and the decisions are no longer hypothetical. Step in, speak up, and immerse yourself in the insights of industry experts and professionals as you experience what it truly means to be in the hot seat.

                Today: February 14, 2026
                Time: 1:00 PM - 3:30 PM
                Where: Zoom

                The pressure is on - and today, diamonds are made.

                For more updates, follow us on:
                Facebook: facebook.com/dlsumafia
                Twitter: twitter.com/dlsumafia
                Instagram: instagram.com/dlsumafia
                LinkedIn: https://bit.ly/mafialinkedin

                #OneMaFIA
                #MaFIAat48
                #MasFunIfAnditoka

                Poster by Ellaine Topia
                Caption by Travis Penaflor

                As Per CSO-PNP Approved OPA-03729`,
                organization: mafia._id,
                image: "/assets/MAFIA_hotseat.jpg",
                createdAt: new Date("2026-02-14")
            },
            {
                title: "JOTS 1: ROARientation!",
                content: `Today's the day to step into new roles and new opportunities!
                We're opening the doors to JOTS 1: ROARientation

                Expect fun and engaging activities, inspiring moments, and memories you'll carry throughout the year. Whether you're here to lead, collaborate, or just enjoy the ride. Come roar with us, meet new faces, and make unforgettable memories!

                February 11, 2026
                4:00-6:00 PM
                AG1103 Lecture Room

                For more updates, follow us on:
                Facebook: facebook.com/dlsumafia
                Twitter: twitter.com/dlsumafia
                Instagram: instagram.com/dlsumafia
                LinkedIn: https://bit.ly/mafialinkedin

                #OneMaFIA
                #MaFIAat48
                #MasFunIfAnditoka

                Poster by JC Chua
                Caption by Gabby Landingin

                As Per CSO-PNP Approved: OPA-03654`,
                organization: mafia._id,
                image: "/assets/MAFIA_jots.jpg",
                createdAt: new Date("2026-02-11")
            },
            {
                title: "MaFIA Activities Lineup - February 2026",
                content: `Save the dates!

                Check out the MaFIA Activities lined up for this week of February! A week full of exciting activities awaits, so don't miss out. We can't wait to see you there!

                For more updates, follow us on:
                Facebook: DLSU MaFIA - Management of Financial Institutions Association
                Twitter: twitter.com/dlsumafia
                Instagram: instagram.com/dlsumafia
                LinkedIn: https://bit.ly/mafialinkedin

                #OneMaFIA
                #MaFIAat48
                #MasFunIfAnditoka

                Poster by Jasmine Francisco
                Caption by Reana Manalo

                As per CSO-PNP Approved: OPA-03737`,
                organization: mafia._id,
                image: "/assets/MAFIA_feb.jpg",
                createdAt: new Date("2026-02-07")
            }
        ];

        const allPosts = [...auPosts, ...csoPosts, ...isoPosts, ...lscsPosts, ...mafiaPosts];

        const createdPosts = await Post.insertMany(allPosts);
        // console.log(`✅ Created ${createdPosts.length} posts`);

        // // Update comments to reference posts
        // await Comment.deleteMany({}); // Clear old comments

        // await Comment.insertMany([
        //     // Post 1 comments (MAUgic in Motion)
        //     { text: "I joined one of your outreach events last term and it was really fulfilling.", user: juan._id, page: "org1", post: createdPosts[2]._id },
        //     { text: "Love the mission of this org! Hoping to volunteer soon.", user: maria._id, page: "org1", post: createdPosts[2]._id },
        //     { text: "Thanks to everyone who participated in our last project! 💚", user: au._id, page: "org1", post: createdPosts[2]._id },
            
        //     // Post 2 comments (World Children's Day)
        //     { text: "The workshops organized here are actually really helpful.", user: john._id, page: "org1", post: createdPosts[1]._id },
        //     { text: "Glad to see more students getting involved in volunteer work.", user: au._id, page: "org1", post: createdPosts[1]._id },
            
        //     // Post 3 comments (2nd General Assembly)
        //     { text: "Looking forward to the next event announcement!", user: maria._id, page: "org1", post: createdPosts[0]._id },
        //     { text: "This org has such a great community.", user: juan._id, page: "org1", post: createdPosts[0]._id }
        // ]);

        // Update comments to reference posts
        await Comment.deleteMany({}); // Clear old comments

        // Get all posts for reference
        const auPost1 = createdPosts.find(p => p.title === "MAUgic in Motion: Unleashing the Powers Within");
        const auPost2 = createdPosts.find(p => p.title === "World Children's Day");
        const auPost3 = createdPosts.find(p => p.title === "2nd General Assembly");

        const csoPost1 = createdPosts.find(p => p.title === "Happy Valentine's Day!");
        const csoPost2 = createdPosts.find(p => p.title === "Top 10 Organizations Overall in DLSU");
        const csoPost3 = createdPosts.find(p => p.title === "CSO Happy New Year");

        const isoPost1 = createdPosts.find(p => p.title === "First General Assembly");
        const isoPost2 = createdPosts.find(p => p.title === "Career Talk 2025: Securing your future");
        const isoPost3 = createdPosts.find(p => p.title === "2nd General Assembly 2026: Introduction to CTF");

        const lscsPost1 = createdPosts.find(p => p.title === "2nd General Assembly" && p.organization.toString() === lscs._id.toString());
        const lscsPost2 = createdPosts.find(p => p.title === "Junior Officer General Assembly: Committee Fair");
        const lscsPost3 = createdPosts.find(p => p.title === "Macky's Heartstrings 2026");

        const mafiaPost1 = createdPosts.find(p => p.title === "MaFIA Activities Lineup - February 2026");
        const mafiaPost2 = createdPosts.find(p => p.title === "JOTS 1: ROARientation!");
        const mafiaPost3 = createdPosts.find(p => p.title === "Into the Hot Seat: Quick Moves, Big FINishes");

        await Comment.insertMany([
            // ===== AU (org1) Comments =====
            // MAUgic in Motion post
            { text: "I joined one of your outreach events last term and it was really fulfilling.", user: juan._id, page: "org1", post: auPost1._id },
            { text: "Love the mission of this org! Hoping to volunteer soon.", user: maria._id, page: "org1", post: auPost1._id },
            { text: "Thanks to everyone who participated in our last project! 💚", user: au._id, page: "org1", post: auPost1._id },
            { text: "When's the next event? I'd love to join!", user: john._id, page: "org1", post: auPost1._id },
            
            // World Children's Day post
            { text: "The workshops organized here are actually really helpful.", user: john._id, page: "org1", post: auPost2._id },
            { text: "Glad to see more students getting involved in volunteer work.", user: au._id, page: "org1", post: auPost2._id },
            { text: "Children are our future! Keep up the good work!", user: maria._id, page: "org1", post: auPost2._id },
            
            // 2nd General Assembly post
            { text: "Looking forward to the next event announcement!", user: maria._id, page: "org1", post: auPost3._id },
            { text: "This org has such a great community.", user: juan._id, page: "org1", post: auPost3._id },
            { text: "See you all at the GA! 🎉", user: john._id, page: "org1", post: auPost3._id },

            // ===== CSO (org2) Comments =====
            // Happy Valentine's Day post
            { text: "Happy Valentine's everyone! 💕", user: juan._id, page: "org2", post: csoPost1._id },
            { text: "Love the message! Spread love always ❤️", user: maria._id, page: "org2", post: csoPost1._id },
            { text: "CSO family is the best!", user: cso._id, page: "org2", post: csoPost1._id },
            { text: "Great pub and caption team! 👏", user: john._id, page: "org2", post: csoPost1._id },
            
            // Top 10 Organizations post
            { text: "Congratulations to all the top orgs! 🎉", user: maria._id, page: "org2", post: csoPost2._id },
            { text: "Proud to be part of this community!", user: juan._id, page: "org2", post: csoPost2._id },
            { text: "Well-deserved recognition for all the hard work!", user: john._id, page: "org2", post: csoPost2._id },
            { text: "Always for Service! 💚", user: cso._id, page: "org2", post: csoPost2._id },
            
            // Happy New Year post
            { text: "Happy New Year CSO! 🎆", user: maria._id, page: "org2", post: csoPost3._id },
            { text: "Looking forward to another great year!", user: juan._id, page: "org2", post: csoPost3._id },
            { text: "2026 is our year! ✨", user: john._id, page: "org2", post: csoPost3._id },

            // ===== ISO (org3) Comments =====
            // First General Assembly post
            { text: "Excited for the first GA!", user: juan._id, page: "org3", post: isoPost1._id },
            { text: "Can't wait to learn more about cybersecurity!", user: maria._id, page: "org3", post: isoPost1._id },
            { text: "See you there ISO fam! 💻", user: iso._id, page: "org3", post: isoPost1._id },
            { text: "Perfect for aspiring security professionals!", user: john._id, page: "org3", post: isoPost1._id },
            
            // Career Talk post
            { text: "AJ Malicsi is a great speaker! Highly recommended!", user: juan._id, page: "org3", post: isoPost2._id },
            { text: "Learned so much about career paths in cyber!", user: maria._id, page: "org3", post: isoPost2._id },
            { text: "Will there be more career talks like this?", user: john._id, page: "org3", post: isoPost2._id },
            { text: "Great turnout for this event! 🔒", user: iso._id, page: "org3", post: isoPost2._id },
            
            // Introduction to CTF post
            { text: "CTF workshops are always fun!", user: maria._id, page: "org3", post: isoPost3._id },
            { text: "Learning a lot about digital forensics!", user: john._id, page: "org3", post: isoPost3._id },
            { text: "When's the next CTF competition?", user: juan._id, page: "org3", post: isoPost3._id },

            // ===== LSCS (org4) Comments =====
            // Macky's Heartstrings post
            { text: "Macky's Heartstrings is my favorite event! ❤️", user: maria._id, page: "org4", post: lscsPost3._id },
            { text: "Sent an anonymous letter to my friend!", user: juan._id, page: "org4", post: lscsPost3._id },
            { text: "The booth was so much fun yesterday!", user: john._id, page: "org4", post: lscsPost3._id },
            { text: "Thanks to everyone who dropped by! 🫶", user: lscs._id, page: "org4", post: lscsPost3._id },
            
            // JOGA Committee Fair post
            { text: "Great event for JOs to find their committees!", user: juan._id, page: "org4", post: lscsPost2._id },
            { text: "Found my home committee! So excited!", user: maria._id, page: "org4", post: lscsPost2._id },
            { text: "The presentations were amazing! 👏", user: john._id, page: "org4", post: lscsPost2._id },
            { text: "Welcome to all our new JOs!", user: lscs._id, page: "org4", post: lscsPost2._id },
            
            // 2nd General Assembly post
            { text: "The Book of Life theme was so creative!", user: maria._id, page: "org4", post: lscsPost1._id },
            { text: "Great energy at the GA!", user: john._id, page: "org4", post: lscsPost1._id },
            { text: "LSCS never disappoints! 🔥", user: juan._id, page: "org4", post: lscsPost1._id },

            // ===== MAFIA (org5) Comments =====
            // Into the Hot Seat post
            { text: "The panel discussion was so insightful!", user: juan._id, page: "org5", post: mafiaPost3._id },
            { text: "Learned a lot about risk management!", user: maria._id, page: "org5", post: mafiaPost3._id },
            { text: "Great speakers from the industry!", user: john._id, page: "org5", post: mafiaPost3._id },
            { text: "Thanks to everyone who attended! 💼", user: mafia._id, page: "org5", post: mafiaPost3._id },
            
            // JOTS 1: ROARientation post
            { text: "JOTS was so much fun! 🦁", user: maria._id, page: "org5", post: mafiaPost2._id },
            { text: "Great way to start the term!", user: juan._id, page: "org5", post: mafiaPost2._id },
            { text: "Met so many new friends!", user: john._id, page: "org5", post: mafiaPost2._id },
            { text: "ROARientation was a success! 🎉", user: mafia._id, page: "org5", post: mafiaPost2._id },
            
            // February Activities Lineup post
            { text: "Excited for all the February events!", user: juan._id, page: "org5", post: mafiaPost1._id },
            { text: "Marking my calendar! 📅", user: maria._id, page: "org5", post: mafiaPost1._id },
            { text: "MAFIA always has the best activities!", user: john._id, page: "org5", post: mafiaPost1._id }
        ]);

        console.log(`✅ Added comments for all posts`);

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
