import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker'

import api from '../../utils/api'
import { Carregando, ItemLog, lastMonths } from '../../utils/componentes';
import { useNavigate, useParams } from 'react-router-dom';
function Index() {
  const months = lastMonths()
  const params = useParams()
  const navigation = useNavigate()
  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState()
  moment.locale('pt-br');
  useEffect(() => {
    moment.locale('pt-br');
    getLogsByDate(params.date ? params.date : new Date())
    // eslint-disable-next-line
  }, [params.date])
  const getLogsByDate = async (data) => {
    let logs = []
    setSubLoading(true)

    await api.get('/?funcao=getLogsByMonth&data=' + moment(data).format('YYYY-MM') + '&token=' + localStorage.getItem('token'))
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
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => {
              setDataSelecionada(date)
              navigation('/Logs/' + moment(date).format('YYYY-MM-DD'))
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />

        </div>
        {
          months.map((item) => (
            <div
              onClick={() => {
                setDataSelecionada(item)
                navigation('/Logs/' + moment(item).format('YYYY-MM-DD'))
              }}
              className={moment(params.date).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD') ? "itemDataSelected" : "itemData"}
              key={item}>
              <p>{moment(item).format('MMMM').charAt(0).toUpperCase() + moment(item).format('MMMM/ YY').slice(1)}</p>
            </div>
          ))
        }
      </div>
      {
        subLoading &&
        <p className='loadingMsg'>Carregando...</p>
      }
      {
        logs.length > 0 ?
          logs.map((e, index) =>
            <ItemLog key={index}
              index={index}
              logs={logs}
              dados={e}
            />
          )
          : !subLoading &&
          <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>
      }

    </div>
  );
}

export default Index;
