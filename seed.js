const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./config");

async function seedUsers() {
  try {
    console.log("Seeding users...");

    await User.deleteMany({});

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
        userType: "admin"
      }
    ];

    await User.insertMany(users);

    console.log("Users seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedUsers();