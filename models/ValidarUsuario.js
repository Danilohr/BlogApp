/**Valida os campos nome, email e senha, e lança os erros por meio da função flash.
 *  - Nenhum dos campos pode ser vazio ou indefinido.
 *  - A senha não pode ser menor que 4 caracteres.
 *  - A segunda senha (senha2) deve coincidir com a primeira.*/ 
var ValidarUsuario = function(req) {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null)
    erros.push({ texto: "Nome inválido" })

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null)
        erros.push({ texto: "E-mail inválido" })

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null)
        erros.push({ texto: "Senha inválido" })

    if (req.body.senha.length < 4)
        erros.push({ texto: "Senha muito curta" })

    if (req.body.senha != req.body.senha2)
        erros.push({ texto: "As senhas não coincidem" })

    
    if(erros.length === 0 && req.flash().length == undefined)
        return true
    
    erros.forEach((erro)=>{
        req.flash("error_msg", erro.texto)
    })

    return false
}

module.exports = ValidarUsuario