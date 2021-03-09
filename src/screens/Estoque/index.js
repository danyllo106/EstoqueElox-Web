import React, { useEffect, useState } from 'react';
import { Carregando, ContainerItem } from '../../utils/componentes'
import api from '../../utils/api'
import './style.css'
function Index() {

  const [dados, setDados] = useState([])
  const [produtos, setProdutos] = useState([])
  const [produtosTemp, setProdutosTemp] = useState([])
  const [pesquisarValue, setPesquisarValue] = useState()
  useEffect(() => {
    getProdutos()
  }, [])

  const getProdutos = async () => {
    let produtos = []

    let params = new URLSearchParams();
    params.append('usuario', 'controlador_estoque');
    params.append('senha', 'kondor987456');

    await api.post('/?funcao=getprodutos', params)
      .then(async (data) => {
        produtos = data.data
      })
      .catch(err => console.log(err))

    await api.post('/?funcao=estoque', params)
      .then(async (data) => {
        let saida = []
        let entrada = []

        await data.data.entrada.forEach(element => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          entrada.push(element)
        });
        await data.data.saida.forEach(element => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          saida.push(element)
        });
        setDados({ entrada, saida })
        let final_estoque = []
        produtos.forEach(element => {
          let saidas = saida.reduce((ac, ar) => {
            return ac + ar.dados.quantidade.reduce((soma, vetor) => {
              if (vetor.id === element.id) {
                return soma + parseInt(vetor.quantidade)
              } else {
                return soma;
              }
            }, 0)
          }, 0)
          let entradas = entrada.reduce((ac, ar) => {
            return ac + ar.dados.quantidade.reduce((soma, vetor) => {
              if (vetor.id === element.id) {
                return soma + parseInt(vetor.quantidade)
              } else {
                return soma;
              }
            }, 0)
          }, 0)

          final_estoque.push({
            ...element,
            quantidade: entradas - saidas,
          })
        })

        setProdutos(final_estoque)
        let produtos_temp = final_estoque.filter(el => { return el.quantidade > 0 })
        setProdutosTemp(produtos_temp)

        return data.data
      })
      .catch(err => console.error(err));

  }
  const pesquisar = async (text) => {
    if (text) {
      let search = produtos.filter((el) => {
        return el.referencia.toUpperCase().includes(text.toUpperCase()) ||
          el.descricao.toUpperCase().includes(text.toUpperCase()) ||
          el.marca.toUpperCase().includes(text.toUpperCase())
      })
      setProdutosTemp(search)
    } else {
      let produtos_temp = produtos.filter(el => { return el.quantidade > 0 })
      setProdutosTemp(produtos_temp)
    }

  }
  if (produtosTemp.length <= 0 && !pesquisarValue)
    return <Carregando />
  return (
    <div style={{ padding: 10 }}>

      <input
        placeholder={"Pesquisar... Ex: 22MPD; 60AH; KONDOR; "}
        onChange={(text) => {
          setPesquisarValue(text.target.value)
          pesquisar(text.target.value)
        }}
        className="pesquisar" />
      <h3 style={{ color: '#aaa' }}>Estoque</h3>
      {
        produtosTemp.map((el) =>
          <ContainerItem key={el.id} dados={el} />
        )
      }
      {
        produtosTemp.length == 0 ?
          <div className="nenhum">
            <p style={{color:'#aaa'}}>Nenhum produto encontrado</p>
          </div>
          : null
      }

    </div>
  );
}

export default Index;
