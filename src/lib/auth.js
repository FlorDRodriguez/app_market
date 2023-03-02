//MÉTODO PARA PROTEGER RUTAS

module.exports = {

    //para proteger las rutas
    isLoggedIn(req, res, next) { //para saber si el usuario esta registrado 
        if(req.isAuthenticated()) { //este es un metodo de passport
            //si exite esa sesión
            return next(); //continua con el siguiente codigo
        }
        //en caso contrario...
        return res.redirect('/signin');
    },   

    //rutas que no quiero que vea el usuario
    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next(); //continua con el siguiente codigo
        }
        //en caso contrario...
        return res.redirect('/profile');
    }
};

