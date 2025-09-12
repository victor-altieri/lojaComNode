import React from 'react'

const Produto = () => {
  return (
    <div>
        <h1>
            Cadastro de Produto
        </h1>

        <form>
            <div>
                <label>Nome do Produto</label>
                <input 
                type="text"
                id='nome'
                placeholder='Digite o nome do roduto'
                />
            </div>
                
            <div>    
                <label>Descrição do Produto</label>
                <input 
                type="text"
                id='nome'
                placeholder='Digite o nome do roduto'
                />
            </div>

            <button>Cadastrar</button>
        </form>

        <ul>
            <li>
                <div>
                    <strong>produto</strong>
                </div>
                <div>
                    <button>Editar</button>
                    <button>Deletar</button>
                </div>
            </li>
        </ul>
    </div>
  )
}

export default Produto