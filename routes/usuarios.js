const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const ValidarUsuario = require("../models/ValidarUsuario")
const bcrypt = require("bcrypt")
const passport = require("passport")


router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    if (ValidarUsuario(req)) {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com este e-mail no nosso sistema")
                res.redirect("registro")
            } else {
                bcrypt.hash(req.body.senha, 10, (erro, hash) => {
                    if (erro) {
                        req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                        res.redirect("/")
                    }
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: hash
                    })

                    novoUsuario.save().then(() => {
                        req.flash("success_msg", "Usuário criado com sucesso!")
                        res.redirect("/")
                    }).catch(() => {
                        req.flash("error_msg", "Erro ao criar o usuário")
                        res.redirect("registro")
                    })
                })


            }
        }).catch(() => {
            req.flash("error_msg", "Erro interno")
            res.redirect("/")
        })
    }
    else
        res.redirect("registro")
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post('/login', function(req, res,next) {
    passport.authenticate('local', { 
        failureRedirect: 'login',
        successRedirect: "/",
        failureFlash: true
    })(req,res,next)
})

router.get("/logout", (req, res)=>{
    req.logOut((erro)=>{
        if(erro)
            req.flash("error_msg", "Erro interno")
        else
            req.flash("success_msg", "Deslogado com sucesso")
        res.redirect("/")
    })
    
})


module.exports = router