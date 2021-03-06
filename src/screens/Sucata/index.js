import React, { useEffect, useState } from 'react';
import { ButtonMostrarMais, Carregando, ExtratoSucata } from '../../utils/componentes'
import api from '../../utils/api'
import PullToRefresh from 'react-simple-pull-to-refresh';
function Index() {
  const [relatorio, setRelatorio] = useState([])
  const [lista, setLista] = useState([]);
  const [quantItens, setQuantItens] = useState(25)
  useEffect(() => {
    getSucata()
    // eslint-disable-next-line
  }, [])
  const getSucata = async () => {
    await api.get('/?funcao=getsucata&token='+localStorage.getItem('token'))
      .then(async (data) => {
        let dados = data.data.entrada
        await data.data.saida.forEach(element => {
          element.valor = element.valor * -1
          dados.push(element)
        });
        dados = await dados.sort((a, b) => { return new Date(b.data.replace(' ','T')) - new Date(a.data.replace(' ','T')) })
        setRelatorio(dados)
        mostrarMais(dados);
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
  if (lista.length <=0)
    return <Carregando/>
  return (
    <PullToRefresh onRefresh={getSucata}>
      <h3 style={{ color: '#aaa',marginLeft:10 }}>Sucata</h3>
      {
        lista.map((item, index) =>
          <ExtratoSucata
            key={index}
            dados={item}
            index={index}
            relatorio={relatorio}
          />
        )
      }
     <ButtonMostrarMais 
      onClick={()=>mostrarMais()}
     />
    </PullToRefresh>
  );
}

export default Index;
