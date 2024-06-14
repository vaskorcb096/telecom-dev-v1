const express = require('express')
const userRouter = express.Router()
const { loginUser, registerUser, getUsers, getUserById, deleteUserById, updateUser } = require('../controllers/userController')
const { validateUserRegistration } = require('../validators/auth')
const runValidation = require('../validators')

userRouter.post('/login', loginUser)
userRouter.post('/register-user', validateUserRegistration, runValidation, registerUser)
userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUserById)

module.exports = userRouter
