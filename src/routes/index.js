//ALMACENA LAS RUTAS PPALES DE LA APP

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router;