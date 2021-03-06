import React, { useEffect, useState } from 'react';
import { ButtonMostrarMais, Carregando, ExtratoEstoque } from '../../utils/componentes'
import api from '../../utils/api'
import PullToRefresh from 'react-simple-pull-to-refresh';
function Index() {
  const [relatorio, setRelatorio] = useState([])
  const [lista, setLista] = useState([]);
  const [quantItens, setQuantItens] = useState(25)
  useEffect(() => {
    getBateria()
    // eslint-disable-next-line
  }, [])
  const getBateria = async () => {
    await api.get('/?funcao=estoque&token='+localStorage.getItem('token'))
      .then(async (data) => {

        let baterias = []

        await data.data.saida.forEach((element) => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          let quantidade = (element.dados.quantidade.reduce((ac, array) => { return ac + parseInt(array.quantidade) }, 0)) * -1
          baterias.push({
            nome: element.dados.nome,
            data: element.lancado,
            valor: quantidade,
            ...element
          })
        });

        await data.data.entrada.forEach((element) => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          let quantidade = (element.dados.quantidade.reduce((ac, array) => { return ac + parseInt(array.quantidade) }, 0))
          baterias.push({
            nome: 'Entrada',
            data: element.lancado,
            valor: quantidade,
            ...element
          })
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
    setQuantItens(quantItens + 25)
  }
  if (lista.length <= 0)
    return <Carregando/>
  return (
    <PullToRefresh onRefresh={getBateria}>
      <h3 style={{ color: '#aaa',marginLeft:10 }}>Bateria</h3>
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
    </PullToRefresh>
  );
}

export default Index;
