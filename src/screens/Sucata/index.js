import React, { useEffect, useState } from 'react';
import { Carregando, ExtratoSucata, lastDays } from '../../utils/componentes'
import api from '../../utils/api'
import 'react-day-picker/lib/style.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from 'moment';
import 'moment/locale/pt-br';
function Index() {
  const dates = lastDays()
  const [valor, setValor] = useState(0)
  const [dataSelecionada, setDataSelecionada] = useState()
  const [lista, setLista] = useState([]);

  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  moment.locale('pt-br');

  useEffect(() => {
    moment.locale('pt-br');
    setLoading(true)
    getSucataByDate(new Date())
    // eslint-disable-next-line
  }, [])

  const getSucataByDate = async (data) => {
    setSubLoading(true)
    await api.get('/?funcao=getSucataByDate&data=' + moment(data).format('YYYY-MM-DD') + '&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        let dados = data.data.entrada
        await data.data.saida.forEach(element => {
          element.valor = element.valor * -1
          dados.push(element)
        });
        dados = await dados.sort((a, b) => { return new Date(b.data.replace(' ', 'T')) - new Date(a.data.replace(' ', 'T')) })
        setLista(dados)
        setValor(data.data.sum)
        setLoading(false)
        setSubLoading(false)
        return data.data
      })
      .catch(err => {
        setLoading(false)
        setSubLoading(false)
        console.error(err)
      }
      );
  }

  if (loading)
    return <Carregando />
  return (
    <div>
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Sucata</h3>

      <div className="itemDataContainer">
        <div id='selectDate'>
          <FaRegCalendarAlt
            size={26}
            className="itemDataIcon"
          />
          <input type='date'
            onChange={(date) => {
              setDataSelecionada(date.target.value)
              getSucataByDate(date.target.value)
            }}
          />

        </div>
        {
          dates.map((item) => (
            <div
              onClick={() => {
                setDataSelecionada(item)
                getSucataByDate(item)
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
          lista.length > 0 ?
            lista.map((item, index) =>
              <ExtratoSucata
                key={index}
                dados={item}
                index={index}
                valor={valor}
                relatorio={lista}
              />
            )
            :
            <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>
      }
    </div>
  );
}

export default Index;
