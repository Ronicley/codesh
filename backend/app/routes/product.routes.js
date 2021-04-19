module.exports = (app) => {
    const products = require('../controller/product.controller');

    app.post('/products', products.create);

    app.get('/products', products.getAll);
    
    app.get('/products/:Id', products.getById);    
}