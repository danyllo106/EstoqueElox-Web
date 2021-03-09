import React, { useEffect, useState } from 'react';
import { ButtonMostrarMais, Carregando, ExtratoSucata } from '../../utils/componentes'
import api from '../../utils/api'
function Index() {
  const [relatorio, setRelatorio] = useState([])
  const [lista, setLista] = useState([]);
  const [quantItens, setQuantItens] = useState(10)
  useEffect(() => {
    getSucata()
  }, [])
  const getSucata = async () => {

    let params = new URLSearchParams();
    params.append('usuario', 'controlador_estoque');
    params.append('senha', 'kondor987456');

    await api.post('/?funcao=getsucata', params)
      .then(async (data) => {
        let dados = data.data.entrada
        await data.data.saida.forEach(element => {
          element.valor = element.valor * -1
          dados.push(element)
        });
        dados = await dados.sort((a, b) => { return new Date(b.data) - new Date(a.data) })
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
    setQuantItens(quantItens + 10)
  }
  if (lista.length <=0)
    return <Carregando/>
  return (
    <div >
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
    </div>
  );
}

export default Index;
