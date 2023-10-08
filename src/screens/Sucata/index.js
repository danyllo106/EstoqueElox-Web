import React, { useEffect, useState } from 'react';
import {  ExtratoSucata,  lastMonths } from '../../utils/componentes'
import {api} from '../../utils/api'
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from 'react-datepicker'
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import 'moment/locale/pt-br';
import { useParams, useNavigate } from 'react-router-dom';
function Index() {
  const params = useParams()
  const months = lastMonths()
  const [valor, setValor] = useState(0)
  const [dataSelecionada, setDataSelecionada] = useState()
  const [lista, setLista] = useState([]);

  const navigation = useNavigate()
  const [subLoading, setSubLoading] = useState(false)
  moment.locale('pt-br');

  useEffect(() => {
    moment.locale('pt-br');
    getSucataByDate(params.date ? params.date : new Date())
    // eslint-disable-next-line
  }, [params.date])

  const getSucataByDate = async (data) => {
    setSubLoading(true)
    await api.get('/?funcao=getSucataByMonth&data=' + moment(data).format('YYYY-MM') + '&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        let dados = data.data.entrada
        await data.data.saida.forEach(element => {
          element.valor = element.valor * -1
          dados.push(element)
        });
        dados = await dados.sort((a, b) => { return new Date(a.data.replace(' ', 'T')) - new Date(b.data.replace(' ', 'T')) })
        setLista(dados)
        setValor(data.data.sum)
        setSubLoading(false)
        return data.data
      })
      .catch(err => {
        setSubLoading(false)
        console.error(err)
      }
      );
  }

  // if (loading)
  //   return <Carregando />
  return (
    <div>
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Sucata</h3>

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
              navigation('/Sucata/' + moment(date).format('YYYY-MM-DD'))
              getSucataByDate(date)
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />

        </div>
        {
          months.map((item) => (
            <div
              onClick={() => {
                navigation('/Sucata/' + moment(item).format('YYYY-MM-DD'))
                getSucataByDate(item)
              }}
              className={moment(item).format('YYYY-MM') === moment(params.date).format('YYYY-MM') ? "itemDataSelected" : "itemData"}
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
        lista.length > 0 ?
          lista.map((item, index) =>
            <ExtratoSucata
              key={index}
              dados={item}
              index={index}
              valor={valor}
              anterior={lista.reduce((ac, ar, i) => index >= i ? ac + parseFloat(ar.valor) : ac, valor)}
              relatorio={lista}
            />
          )
          : !subLoading &&
          <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>
      }
    </div>
  );
}

export default Index;
