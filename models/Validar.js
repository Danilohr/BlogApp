/**Valida os campos nome e slug, e lança os erros por meio da função flash.
 *  - Nenhum dos campos pode ser vazio ou indefinido.
 *  - O nome não pode ser menor que 4 caracteres.*/ 
var Validar = function(req){
    let erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    else if(req.body.nome.length < 4)
        erros.push({texto: "Nome da categoria é muito pequeno"})

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null
        || req.body.slug.trim().indexOf(' ')>0){
        erros.push({texto: "Slug inválido"})
    }


    if(erros.length === 0 && req.flash().length == undefined)
        return true
    
    erros.forEach((erro)=>{
        req.flash("error_msg", erro.texto)
    })

    return false;
}

module.exports = Validar