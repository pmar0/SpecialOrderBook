const SpecialOrderController = require('../controllers/specialorders.controller');
const {authenticate, verify} = require('../config/jwt.config');

module.exports = app => {
    app.get('/api/special_order', authenticate, SpecialOrderController.findAllSpecialOrders);
    // app.get('/api/special_order/:userId', authenticate, SpecialOrderController.findSpecialOrdersByUser);
    app.get('/api/special_order/:id', authenticate, SpecialOrderController.findOneSpecialOrder);
    app.put('/api/special_order/:id', authenticate, SpecialOrderController.updateExistingSpecialOrder);
    app.post('/api/special_order', authenticate, SpecialOrderController.createNewSpecialOrder);
    app.delete('/api/special_order/:id', authenticate, SpecialOrderController.deleteExistingSpecialOrder);
}