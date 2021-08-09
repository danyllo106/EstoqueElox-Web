import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

import api from '../../utils/api'
import { Carregando, ItemLog, lastDays } from '../../utils/componentes';
function Index() {
  const dates = lastDays()

  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState()
  useEffect(() => {
    getLogsByDate('2021-08-06')
    // eslint-disable-next-line
  }, [])
  const getLogsByDate = async (data) => {
    let logs = []
    setSubLoading(true)

    await api.get('/?funcao=getLogsByDate&data=' + moment(data).format('YYYY-MM-DD') + '&token=' + localStorage.getItem('token'))
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
        setLogs(logs)
        setLoading(false)
        setSubLoading(false)
        return data.data
      })
      .catch(err => {
        setLoading(false)
        setSubLoading(false)
        console.error(err)
      });

  }
  

  if (loading)
    return <Carregando />
  return (
    <div>
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Logs</h3>
      <div className="itemDataContainer">
        <div id='selectDate'>
          <FaRegCalendarAlt
            size={26}
            className="itemDataIcon"
          />
          <input type='date'
            onChange={(date) => {
              setDataSelecionada(date.target.value)
              getLogsByDate(date.target.value)
            }}
          />

        </div>
        {
          dates.map((item) => (
            <div
              onClick={() => {
                setDataSelecionada(item)
                getLogsByDate(item)
              }}
              className={moment(dataSelecionada).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD') ? "itemDataSelected" : "itemData"}
              key={item}>
              <p>{new Date(item).getDate()}</p>
              <p>{moment(item).format('MMMM').charAt(0).toUpperCase() + moment(item).format('MMMM').slice(1)}</p>
            </div>
          ))
        }
      </div>
      {
        subLoading ?
          <p className='loadingMsg'>Carregando...</p>
          :
          logs.length > 0 ?
            logs.map((e, index) =>
              <ItemLog key={index}
                index={index}
                logs={logs}
                dados={e}
              />
            )
            :
            <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>
      }

    </div>
  );
}

export default Index;
