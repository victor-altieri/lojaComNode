const express = require("express");//importa o módulo express que contruir o servidior
const cors = require("cors");//permite que acesse rotas diferentes(domínios)
const bodyParser= require("body-parser");// middleware que analisa o corpo da requisição de entrada HTTP(dados que vem do formulario)
const {v4:uuid} = require("uuid");//função responsavel por gerar ID´s unicos 
const fs = require("fs") //MANIPULA ARQUIVOS
const path = require("path"); //DEFINE CAMINHO DOS ARQUIVOS
const { error } = require("console");


// INSTANCIANDO O EXPRESS
const app = express();
// DEFINE A PORTA DO SERVIDOR
const Port = 3001;

//usando o cors
app.use(cors());
// usando o body-parse para a requisição
app.use(bodyParser.json());

//LOCAL DO ARQUIVO JSON
const caminho = path.join(__dirname, "produtos.json")

//FUNÇO PARA LER OS DADOS DO ARQUIVO
const lerProdutos = ()=>{
    try{
        const data = fs.readFileSync(caminho, "utf-8")
        return JSON.parse(data)
    } catch(error){
        console.error("erro ao ler o arquivo", error)
    }
}

//FUNÇÃO PARA GRAVAR DADOS NO ARQUIVO
const salvarProdutos=(data)=>{
    try{
        fs.writeFileSync(caminho, JSON.stringify(data, null, 2), "utf-8")
    } catch(error){
        console.error("erro ao salvar dados n o arquivo", error)
    }
}


// VARIAVEL QUE RECEBE A FUNÇÃO LER PRODUTOS
let produtos =lerProdutos();

// CRIANDO A ROTA CADASTRAR PRODUTO (post)

app.post("/produto",(req,res)=>{
    // desestruct- requisição das variaveis que serão manipuladas no corpo da aplicação
    const {nome,descricao} = req.body
    //  validando os campos das variaveis
    if(!nome || !descricao){
        return res.status(400).json({error:"Campos inválidos"})
    }
    //  realiza o novo cadastro com id,nome e descricao
    const novoItem ={id:uuid(),nome,descricao}
    // pega o que foi cadastraro e coloca no array produtos
    produtos.push(novoItem);
    //salva os dados no arquivo json
    salvarProdutos(produtos);
    // retorna a mensagem de sucesso
    res.status(201).json({message:"Cadastrado Efetuado com sucesso"})
})

// ROTA PARA CONSULTAR OS PRODUTOS CADASTRADOS (get)
app.get("/produto",(req,res)=>{
    res.json(produtos)
})

app.get("/produto/search", (req, res) => {
    const {pesquisa} = req.query;
    if(!pesquisa){
        return res.status(400).json({error: "pesquisa nao encontrada"})
    }

    const termoPesquisa = pesquisa.toLowerCase();
    const resultado = produtos.filter(item=>item.nome.toLowerCase().includes(termoPesquisa)| item.descricao.toLowerCase().includes(termoPesquisa))
})

// ROTA PARA ALTERAR PRODUTO CADASTRADO

app.put("/produto/:id", (req,res)=>{
     const produtoId =req.params.id;   //Obtém o ID do produto na url
     const {nome,descricao}= req.body;
       //  validando os campos das variaveis
    if(!nome || !descricao){
        return res.status(400).json({error:"Campos inválidos"})
    }
    const produtoIndex = produtos.findIndex(item=>item.id ===produtoId);
      if(produtoIndex === -1){
        return res.status(404).json({error:"Produto não encontrado"})
    }
    produtos[produtoIndex]={id:produtoId,nome, descricao};
    salvarProdutos(produtos)
    res.json(produtos[produtoIndex])

})

// ROTA PARA DELETAR O PRODUTO CADASTRADO (delete)

app.delete("/produto/:id",(req,res)=>{
     //Obtém o ID do produto na url
    const produtoId =req.params.id;  
    // Armazean o tamanho inicial do array de produtos
    const inicioProduto = produtos.length;
    // filtra o array, removendo o produto com id escolhido
    produtos = produtos.filter(item =>item.id !== produtoId)

    // verifica se o produto foi removido
     if(produtos.length == inicioProduto){
        return res.status(404).json({error:"Produto não encontrado"})
    }
    salvarProdutos(produtos)
    // mensagem afirmando que o produto foi removido
    res.status(404).send("Produto removido com sucesso")

})


//Executando a escuta do servidor
app.listen(Port, ()=>{
    console.log(`Servidor rodando na porta http://locahost:${Port}`)
})
