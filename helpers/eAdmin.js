module.exports = {
    eAdmin: function(req, res, next){
        if (req.isAuthenticated() && req.user.admin == true)
            return next()

        req.flash("error_msg", "Você não tem permissões para acessar aqui!")
        res.redirect("/")
    }
}