require('dotenv').config()
const serverPort = process.env.SERVER_PORT || 4001
const mongodbURL = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/telecomDB'
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/rasel.jpg'
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'hgffg_u88hbbb'
const smtpUsername = process.env.SMTP_USERNAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''
const clientURL = process.env.CLIENT_URL || ''


module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL
}