const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")



module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "email" , passwordField:"senha"}, (email, senha, done) => {

        Usuario.findOne({ email: email }).lean().then((usuario) => {

            if (!usuario)
                return done(null, false, { message: "Esta conta não existe" })
            else {
                bcrypt.compare(senha, usuario.senha, (_erro, batem) => {
                    if (batem)
                        return done(null, usuario)
                    else
                        return done(null, false, { message: "Senha incorreta" })
                })
            }
        })
    }))
    

    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario)=>{
            done(null, usuario)
        })
    })

}