const {Router} = require('express');
const routes = Router();
const auth = require('./middlewares/auth');
const userController = require('./controllers/user');
const sessionController = require('./controllers/session');
const healthController = require('./controllers/health');
const batController = require('./controllers/bat');

routes.get('/__health_check', healthController.check);
routes.post('/users', userController.create);
routes.post('/authenticate', sessionController.logIn);
routes.post('/forgot_password', sessionController.forgotPassword);
routes.post('/reset_password', sessionController.resetPassword);

routes.use(auth);
routes.get('/users', userController.index);
routes.get('/users/:id', userController.show);
routes.post('/users/:id/disable', userController.activeUser);
routes.put('/users/:id', userController.activeUser);
routes.get('/bats', batController.index);
routes.get('/bats/:id', batController.show);
routes.post('/bats', batController.create);
routes.put('/bats/:id', batController.update);
routes.get('/bats/:id/download', batController.downloadFile);

module.exports = routes;
