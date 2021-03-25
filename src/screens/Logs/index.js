import React, { useEffect, useState } from 'react';

import api from '../../utils/api'
import { ButtonMostrarMais, Carregando, ItemLog } from '../../utils/componentes';
function Index() {
  const [result, setResult] = useState([])
  const [logs, setLogs] = useState([])
  const [max, setMax] = useState(25)
  useEffect(() => {
    getLogs() 
    // eslint-disable-next-line
  }, [])
  const getLogs = async () => {
    let logs = []
    let params = new URLSearchParams();
    params.append('usuario', 'controlador_estoque');
    params.append('senha', 'kondor987456');
    await api.post('/?funcao=logs&toksen='+localStorage.getItem('token'),params)
      .then(async (data) => {
        
        data.data.forEach((element, index) => {
          if (element.classe === "bateria") {
            element.dados = JSON.parse(element.dados)
            if (element.funcao !== "deletar_entrada" && element.funcao !== "deletar_saida")
              if (element.funcao !== "atualizar_entrada" && element.funcao !== "atualizar_saida") {
                element.dados.dados = JSON.parse(element.dados.dados)
                element.dados.dados.quantidade = JSON.parse(element.dados.dados.quantidade)
              } else {
                element.dados.newdata.dados = JSON.parse(element.dados.newdata.dados)
                element.dados.newdata.dados.quantidade = JSON.parse(element.dados.newdata.dados.quantidade)
                element.dados.olddata.dados = JSON.parse(element.dados.olddata.dados)
                element.dados.olddata.dados.quantidade = JSON.parse(element.dados.olddata.dados.quantidade)

              }
            logs.push(element)
          } else {

            element.dados = JSON.parse(element.dados)
            logs.push(element)

          }
        });
        setResult(logs)
        setLogs(logs.filter((el, index) => { return index <= max ? el : null }))
        return data.data
      })
      .catch(err => console.error(err));

  }
  function verMais() {
    setLogs(result.filter((el, index) => { return index <= max + 25 ? el : null }))
    setMax(max + 25)
  }
  if (logs.length === 0)
    return <Carregando />
  return (
    <div >
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Logs</h3>
      {
        logs.map((e, index) =>
          <ItemLog key={index}
            index={index}
            logs={result}
            dados={e}
          />
        )
      }
      <ButtonMostrarMais onClick={() => verMais()} />

    </div>
  );
}

export default Index;