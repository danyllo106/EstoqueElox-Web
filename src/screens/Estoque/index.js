import React, { useEffect, useState } from 'react';
import { Carregando, ContainerItem } from '../../utils/componentes'
import api from '../../utils/api'
function Index() {

  const [dados, setDados] = useState([])
  const [produtos, setProdutos] = useState([])
  const [produtosTemp, setProdutosTemp] = useState([])

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
        setProdutosTemp(final_estoque)

        return data.data
      })
      .catch(err => console.error(err));

  }
  if (produtosTemp.length <= 0)
    return <Carregando />
  return (
    <div >
      <p>Estoque</p>
      {
        produtosTemp.map((el) =>
          <ContainerItem key={el.id} dados={el} />
        )
      }

    </div>
  );
}

export default Index;
