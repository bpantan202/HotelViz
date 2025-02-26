const express = require("express");
const { register, reset, login, deleteUser, getMe, logout } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - name
*         - tel
*         - email
*         - password
*       properties:
*         name:
*           type: string
*           description: User's name
*           example: John Doe
*         tel:
*           type: string
*           description: User's telephone number
*           example: 123-456-7890
*         email:
*           type: string
*           description: User's email address
*           example: john@example.com
*         role:
*           type: string
*           description: User's role
*           enum: 
*             - user
*             - admin
*           default: user
*         password:
*           type: string
*           description: User's password
*           example: password123
*         tier:
*           type: string
*           description: User's tier
*           enum:
*             - Bronze
*             - Silver
*             - Gold
*             - Platinum
*           default: Bronze
*         experience:
*           type: number
*           description: User's experience points
*           example: 100
*         point:
*           type: number
*           description: User's points
*           example: 50
*         coupons:
*           type: array
*           description: User's coupons
*           items:
*             type: string
*             format: uuid
*             example: 660255d64df8323ed9dafe43
*         resetPasswordToken:
*           type: string
*           description: Token for resetting password
*         resetPasswordExpire:
*           type: string
*           format: date-time
*           description: Expiry date for resetting password token
*         createdAt:
*           type: string
*           format: date-time
*           description: Date and time when the user was created
*           example: 2024-04-25T12:00:00Z
*       example:
*         name: John Doe
*         tel: 123-456-7890
*         email: john@example.com
*         role: user
*         password: password123
*         tier: Bronze
*         experience: 100
*         point: 50
*         coupons: []
*         resetPasswordToken: abcdefg123456
*         resetPasswordExpire: 2024-05-25T12:00:00Z
*         createdAt: 2024-04-25T12:00:00Z
*/
/**
* @swagger
* tags:
*   name: Users
*   description: The users managing API
*/
/**
* @swagger
* /auth/login:
*   post:
*     summary: Login user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*                 description: User's email address
*                 example: test@gmail.com
*               password:
*                 type: string
*                 description: User's password
*                 example: password123
*     responses:
*       200:
*         description: User logged in successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: Authentication token for the user
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAyNTVkNjRkZjgzNDNlZDlkYWZlMzUiLCJpYXQiOjE2MTg4NzUwOTksImV4cCI6MTYxODg4MzA5OX0.ZvtQG2bgxN9H5RCg6aB-VsFnxLx1G8N9wRlkQXkx4cA
*       401:
*         description: Invalid credentials
*       500:
*         description: Server error
*/
/**
* @swagger
* /auth/register:
*   post:
*     summary: Register a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: User's name
*                 example: John Doe
*               tel:
*                 type: string
*                 description: User's telephone number
*                 example: 123-456-7890
*               email:
*                 type: string
*                 format: email
*                 description: User's email address
*                 example: john@example.com
*               password:
*                 type: string
*                 description: User's password
*                 example: password123
*     responses:
*       201:
*         description: User registered successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: string
*                   description: ID of the newly registered user
*                   example: 660255d64df8343ed9dafe35
*                 name:
*                   type: string
*                   description: User's name
*                   example: John Doe
*                 tel:
*                   type: string
*                   description: User's telephone number
*                   example: 123-456-7890
*                 email:
*                   type: string
*                   format: email
*                   description: User's email address
*                   example: john@example.com
*       400:
*         description: Bad request, user already exists
*       500:
*         description: Server error
*/
/**
* @swagger
* /auth/reset:
*   put:
*     summary: Reset user password
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               current_password:
*                 type: string
*                 description: User's current password
*                 example: password123
*               new_password:
*                 type: string
*                 description: User's new password
*                 example: newpassword
*     responses:
*       200:
*         description: Password reset successfully
*       400:
*         description: Bad request
*       500:
*         description: Server error
*/
/**
* @swagger
* /auth/logout:
*   get:
*     summary: Logout user
*     tags: [Users]
*     responses:
*       200:
*         description: User logged out successfully
*       500:
*         description: Server error
*/
/**
* @swagger
* /auth/deleteUser:
*   delete:
*     summary: Delete user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               password:
*                 type: string
*                 description: User's password
*                 example: password123
*     responses:
*       200:
*         description: User deleted successfully
*       401:
*         description: Unauthorized, user not logged in
*       500:
*         description: Server error
*/
/**
* @swagger
* /auth/me:
*   get:
*     summary: Get logged-in user
*     tags: [Users]
*     responses:
*       200:
*         description: User logged out successfully
*       500:
*         description: Server error
*/


router.post("/register", register);
router.put("/reset", protect, reset);
router.delete("/deleteUser", protect, deleteUser);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
