const cors = require('cors') //permite que acesse rotas diferentes (domínios)

const express = require('express') //importa o módulo express que vai construir o servidor

const {v4:uuid} = require("uuid") // função responsável por gerar ID's únicos

const bodyParser = require('body-parser') //middleware que analisa o corpo da requisição de entrada HTTP (dados que vem do formuário)

//Instânciando o express 
const app = express();

// define a porta do servidor
const Port = 3001;

//usando o cors
app.use(cors());

//usando o body parse para a requisição
app.use(bodyParser.json());


//Variavel que recebe um array vazio
let produtos = [];

//criando a rota cadastrar produto
app.post("/produto", (req,res)=>{
    // destruct- requisição das variáveis que serão manipuladas no corpo da aplicação
    const {nome,descricao} = req.body

    if(!nome || !descricao){

        return res.status(400).json({error:"Campos inválidos"})
    }

    //realiza o novo cadastro vom id, nome e descrição
    const novoItem = {id:uuid(),nome,descricao}
    //pega o que foi cadastrado e coloca no array produtos
    produtos.push(novoItem);
    res.status(201).json({message:"Cadastro efetuado com sucesso"})
})

//Rota para consultar os produtos cadastrados
app.get('/produto', (req,res)=>{
    res.json(produtos)
})

//rota para alterar produto cadastrado
app.put("/produto/id:", (req,res)=>{
    const produtoId = req.params.id; //obtém o id do produto na url
    const {nome,descrição} = req.body;
    //validando o campo dos usuários
    if(!nome || !descricao){

        return res.status(400).json({error:"Campos inválidos"})
    }

    const produtoIndex = produtos.findIndex(item=>item.id === produtoId);
    if(produtoIndex === -1){
        return res.status(404).json({error:"Produto não encontrado"})
    }

    produtos[produtosIndex] = {id:produtoId, nome, descricao};
    res.json(produtos[produtoIndex])

})

// rota para deletar o produto cadastrado (delete)
app.delete("/produtos/id:", (req,res)=>{
    const produtoId = req.params.id; //obtém o id do produto na url
    // armazena o tamanho inicial do array de produtos
    const inicioProdutos = produtos.length;
    produtos = produtos.filter(item => item.id !== produtoId)

    //verifica se o produto foi removido
    if(produtos.length == inicioProduto){
        return res.status(404).json({error:"Produto não encontrado"})
    }
})

  // mensagem afirmando que o produto foi removido
    res.status(404).send("Produto removido com sucesso")


//localizando a escuta do servidor
app.listen(Port, ()=>{
    console.log(`Servidor rodando na porta http://localhost:${Port}`)
})