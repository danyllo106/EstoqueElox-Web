import React, { useEffect, useState } from 'react';
import { ButtonMostrarMais, Carregando, ExtratoEstoque, BackButton } from '../../utils/componentes'
import api from '../../utils/api'
import { useParams } from 'react-router';
function Index() {
  const [relatorio, setRelatorio] = useState([])
  const [lista, setLista] = useState([]);
  const [quantItens, setQuantItens] = useState(10)
  const [referencia, setReferencia] = useState()
  const [descricao, setDescricao] = useState()
  const [marca, setMarca] = useState()
  let { id } = useParams()
  useEffect(() => {
    getBateria()
    // eslint-disable-next-line
  }, [id])

  const getBateria = async () => {
    

    await api.get('/?funcao=estoque&token='+localStorage.getItem('token'))
      .then(async (data) => {

        let baterias = []
        await data.data.saida.forEach((element) => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          let quantidade = (element.dados.quantidade.reduce((ac, array) => { return array.id === id ? ac + parseInt(array.quantidade) : ac }, 0)) * -1

          if (element.dados.quantidade.filter(el => { return el.id === id }).length > 0) {
            setReferencia(element.dados.quantidade.filter(el => { return el.id === id })[0].referencia)
            setDescricao(element.dados.quantidade.filter(el => { return el.id === id })[0].descricao)
            setMarca(element.dados.quantidade.filter(el => { return el.id === id })[0].marca)
            baterias.push({
              nome: element.dados.nome,
              data: element.lancado,
              valor: quantidade,
              ...element
            })
          }
        });

        await data.data.entrada.forEach((element) => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          let quantidade = (element.dados.quantidade.reduce((ac, array) => { return array.id === id ? ac + parseInt(array.quantidade) : ac }, 0))
          if (element.dados.quantidade.filter(el => { return el.id === id }).length > 0) {
            setReferencia(element.dados.quantidade.filter(el => { return el.id === id })[0].referencia)
            setDescricao(element.dados.quantidade.filter(el => { return el.id === id })[0].descricao)
            setMarca(element.dados.quantidade.filter(el => { return el.id === id })[0].marca)
            baterias.push({
              nome: 'Entrada',
              data: element.lancado,
              valor: quantidade,
              ...element
            })
          }
        });
        baterias = await baterias.sort((a, b) => { return new Date(b.lancado.replace(' ','T')) - new Date(a.lancado.replace(' ','T')) })
        setRelatorio(baterias)
        mostrarMais(baterias);

        return data.data
      })
      .catch(err => console.error(err));

  }
  function mostrarMais(lista = relatorio) {

    let array = []
    lista.forEach(async (el, index) => {
      if (index < quantItens)
        await array.push(el)
    })
    setLista(array);
    setQuantItens(quantItens + 10)
  }
  if (lista.length <= 0)
    return <Carregando />
  return (
    <div >
      <BackButton />
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Referência:</b> {referencia}</p>
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Descrição:</b> {descricao}</p>
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Marca:</b> {marca}</p>
      {
        lista.map((element, index) =>
          <ExtratoEstoque
            key={index}
            index={index}
            relatorio={relatorio}
            dados={element}
          />
        )
      }
      <ButtonMostrarMais
        onClick={() => mostrarMais()}
      />
    </div>
  );
}

export default Index;
