	import { useState,useEffect } from "react";
import axios from 'axios'

const Produto = () => {
    // DECLARANDO A URL DA API QUE SERÁ CONSUMIDA
    const API_URL = "http://localhost:3001/produto";

    // HOOK- useState Manipula o estado da variável
    const [produto, setProduto]=useState([]);
    const [novoProduto, setNovoProduto]=useState({nome:"",descricao:""});
    const [editar, setEditar]=useState(false);

    // CADASTRAR PRODUTO
    const cadastrarProduto =async ()=>{
        // VALIDAR CAMPOS
        if(!novoProduto.nome || !novoProduto.descricao){
            alert("Campos obrigatórios")
            return;
        }
        // TRATAMENTO DE ERROS
        try{
            const response = await axios.post(API_URL,novoProduto);
            setProduto([...produto,response.data])
            setNovoProduto({nome:"", descricao:""})
            setEditar(false);
        }
        catch(error){
            console.log("Erro ao cadastrar o produto",error)
        }
    }

    // HOOK useEffect - EFEITO PARA CARREGAR A LISTAR DE TODOS OS PRODUTOS CADASTRADOS

    useEffect(()=>{
        consultarProdutos();
    })

    // CONSULTAR PRODUTOS CADASTRADOS
    const consultarProdutos= async ()=>{
        try{
            const response = await axios.get(API_URL);
            setProduto(response.data);

        }
        catch(error){
            console.log("Erro ao consultar produto",error)
        }
    }
    
    // ALTERAR PRODUTO CADASTRADO

    const alterarProduto = async()=>{
        if(!novoProduto.nome || !novoProduto.descricao){
            alert("Campos obgrigatórios")
            return;
        } 
        // TRATAMENTO DE ERROS
        try{

        const response =await axios.put(`${API_URL}/${novoProduto.id}`,novoProduto);
        setProduto(produto.map(produto =>produto.id === novoProduto.id ? response.data : produto))
        setNovoProduto({nome:"",descricao:""})
        setEditar(false);

        }catch(error){
            console.log("Erro ao alterar produto",error)
        }
    }

    // DELETAR UM PRODUTO CADASTRADOS

    const deletarProduto =async (id)=>{
        if(window.confirm("Tem certeza que deseja deleta este produto")){
            try{
                await axios.delete(`${API_URL}/${id}`);
                setProduto(produto.filter((item)=>item.id !== id));
            }
            catch(error){
                    console.log("Error ao excluir um produto",error)
            }
        }else{
            console.log("Exclusão do produto cancelada")
        }
    }

    // METODO ALTERAR
    const handleAlterar=(produto)=>{
        setNovoProduto(produto)
        setEditar(true);
    }
    // METODO SUBMIT QUE VAI ATULIZAR O BOTÃO DO FORMULARIO
    const handleSubmit =()=>{
        if(editar){
            alterarProduto();
        }else{
            cadastrarProduto();
        }
    }

  return (
    <div className="mx-auto p-4">
      <h1 className=" text-2xl font-bold mb-4">Cadastro de Produto</h1>
      <form className="mb-4">
        <div className="mb-4">
          <label className=" block text-xl font-medium text-gray-700">Nome Produto</label>
          <input 
           type="text"
           id="nome" 
           placeholder="Digite o nome Produto"
           value={novoProduto.nome} //pega a variavel do useState
            // pega o que o for digitado no campo    
           onChange={(e)=>setNovoProduto({...novoProduto, nome: e.target.value})}
           className="mt-2 border rounded w-full"
           
           />
        </div>

        <div>
          <label className=" block text-xl font-medium text-gray-700">Descrição Produto</label>
          <input
            type="text"
            id="descricao"
            placeholder="Digite descrição Produto"
            value={novoProduto.descricao}
            onChange={(e)=>setNovoProduto({...novoProduto, descricao : e.target.value})}
            className="mt-2 border rounded w-full"
          />
        </div>
            <button onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-900 tex-white font-bold py-2 px-4 mt-4 rounded">
                {editar ? "Alterar" : "Cadastrar"}
            </button>
      </form>
      <ul>
        {produto.map(item =>(
        <li key={item.id} className="border p-2 mb-4 rounded flex items-center justify-between">
            <div>
                <strong className="font-semibold">{item.nome}</strong>{item.descricao}
            </div>
            <div>
                <button onClick={()=>handleAlterar(item)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-2 rounded mr-2">Editar</button>
                <button onClick={()=>deletarProduto(item.id)}
                     className="bg-red-500 hover:bg-yellow-600 text-black font-bold py-2 px-2 rounded mr-2">Deletar</button>
            </div>
        </li>
        ))}     
      </ul>
    </div>
  );
};

export default Produto;
