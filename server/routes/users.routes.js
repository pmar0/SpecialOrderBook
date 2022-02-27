const UserController = require('../controllers/users.controller');
const {verify} = require('../config/jwt.config');

module.exports = app => {
    app.post('/api/user/register', UserController.register);
    app.get('/api/user/verify/:userId/:verificationCode', UserController.verify)
    app.get('/api/user/resendCode/:userId/', UserController.resendCode)
    // app.post('/api/user/verify/:userId/:verificationCode', UserController.verify)
    app.post('/api/user/login', UserController.login);
    app.post('/api/user/logout', UserController.logout);
    app.get('/api/user/:id', UserController.getOneUser);
    app.delete('/api/user/:id', UserController.deleteExistingUser);
    app.get('/api/user', UserController.getAllUsers);
}

//deal with user verification, issue different token for unverified user to ensure theyre navigated to verify page