//RUTA P ALMACENAR LOS PRODUCTOS

const express = require ('express');
const router = express.Router();
const pool = require('../database'); //pool hace referencia a la conexion a la db

const { isLoggedIn } = require('../lib/auth');//de ese archivo importo ese metodo

//AGREGAR UN PRODUCTO
router.get('/add_p', isLoggedIn, async (req, res) => {
    res.render('products/add_p');
});
/*router.get('/add_p', isLoggedIn, async (req, res) => {
    const { id } = req.user;
    const categories = await pool.query('SELECT * FROM categories WHERE user_id = ?', [id]);
    res.render('products/add_p', { categories });
});codigo marcos*/

router.post('/add_p', isLoggedIn, async (req , res) =>{
    const { namee, brand, min_desc, quantity, category_id } = req.body;//del objeto quiero esa prop
    const newProduct = { //guardo los datos dentro de un nuevo objeto
        namee,
        brand,
        min_desc,
        quantity,
        category_id,
        user_id: req.user.id
    };
    
    await pool.query('INSERT INTO products set ?', [newProduct]);//guardo los datos en la db
    req.flash('success', 'Producto agregado exitosamente');
    res.redirect('/products/list_p');
});


//LISTAR LOS PRODUCTOS
router.get('/list_p',isLoggedIn, async (req, res) => { //seria /products pero todos los product preceden con /product
    const products = await pool.query('SELECT * FROM products');
    res.render('products/list_p', { products });//le pasa los links a esta vista
});


//ELIMINAR UN PRODUCTO
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;//id que está pasando el usuario
    await pool.query('DELETE FROM products WHERE id = ?', [id]);//el ? es el paramentro que se le pasa a continuacion
    req.flash('success', 'Producto quitado exitosamente');
    res.redirect('/products/list_p');
});


//EDITAR UN PRODUCTO
router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;//id que está pasando el usuario
    const products = await pool.query('SELECT * FROM products WHERE id = ?', [id]);//el ? es el paramentro que se le pasa a continuacion
    res.render('products/edit_p', {product: products[0]}); //te pasa la propiedad links con los valores que traje de la db
});

//ACTUALIZA LOS DATOS QUE SE MODIFICAN
router.post('/edit_p/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { namee, brand, min_desc, quantity } = req.body; 
    const newProduct = {
        namee,
        brand,
        min_desc,
        quantity
    };
    await pool.query('UPDATE products set ? WHERE id = ?', [newProduct, id]);
    req.flash('success', 'Producto actualizado exitosamente');
    res.redirect('/products/list_p');
});

module.exports = router;