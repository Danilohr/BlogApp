// Router the middleware function that contains all defined routes, 
// and performs route lookup based on the current request url and HTTP method.
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const Validar = require("../models/Validar")
require("../models/Post")
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Página de categorias")
})
router.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/categorias", {categorias:categorias})
    }).catch(() =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})
router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})
router.post("/categorias/nova", (req, res)=>{
    if(Validar(req)){
        const novaCategoria = {
            nome: req.body.nome.trim(),
            slug: req.body.slug.trim()
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch(() => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }

})
router.get("/categorias/edit/:id", (req, res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias", {categoria:categoria})
    }).catch(() => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias") 
    })
})
router.post("/categorias/edit", (req, res)=>{
    if(Validar(req)){
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
            categoria.nome = req.body.nome.trim()
            categoria.slug = req.body.slug.trim()
            categoria.save().then(()=>{
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch(()=> {
                req.flash("error_msg", "Houve um erro ao salvar a edição da categoria")
                res.redirect("/admin/categorias")
            })
        }).catch(()=>{
            req.flash("error_msg", "Erro ao editar categoria")
            res.redirect("/admin/categorias")
        })
    }
    else
        res.redirect("/admin/categorias/edit/"+req.body.id)
})
router.post("/categorias/deletar", (req, res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch(()=>{
        req.flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

// Área de postagens
router.get("/postagens", (req, res)=>{
    Postagem.find().populate("categoria").sort({data:"desc"}).lean().then((postagens)=>{
        res.render("admin/postagens", {postagens:postagens})
    }).catch((erro)=>{
        console.log(erro)
        req.flash("error_msg", "Erro ao listar postagens")
        res.redirect("/admin/postagens")
    })
})
router.get("/postagens/add", (req, res)=>{
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias:categorias})
    }).catch(()=>{
        req.flash("error_msg", "Erro ao carregar formulário")
        res.redirect("/admin/postagens")
    })
})
router.post("/postagens/nova", (req, res)=>{
    if(req.body.categoria == "0")
        req.flash("error_msg", "Selecione uma categoria!")
    if (Validar(req)){
        const novaPostagem = {
            titulo:req.body.nome.trim(),
            descricao:req.body.descricao.trim(),
            slug:req.body.slug.trim(),
            conteudo:req.body.conteudo.trim(),
            categoria:req.body.categoria.trim()
        }
        new Postagem(novaPostagem).save().then(()=> {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch(()=>{
            req.flash("error_msg", "Erro ao criar postagem")
            res.redirect("/admin/postagens/add")
        })
    }
    else
        res.redirect("/admin/postagens/add")
})
router.get("/postagens/edit/:id", (req, res)=>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias) =>{
            res.render("admin/editpostagens", {categorias: categorias, postagem:postagem})
        }).catch(()=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens") 
        })
    }).catch(() => {
        console.log("Erroaaaaaa")
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/postagens") 
    })
})
router.post("/postagem/edit", (req, res)=>{
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.nome
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch(() => {
            req.flash("error_msg", "Erro ao salvar edição de postagem")
            res.redirect("/admin/postagens")
        })
    }).catch(() => {
        req.flash("error_msg", "Erro ao encontrar postagem para editar")
        res.redirect("/admin/postagens") 
    })
})

module.exports = router