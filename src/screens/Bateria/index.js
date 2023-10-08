import React, { useEffect, useState } from 'react';
import { ExtratoEstoque,  lastMonths } from '../../utils/componentes'
import {api} from '../../utils/api'
import moment from 'moment';
import 'moment/locale/pt-br';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker'
import { useNavigate, useParams } from 'react-router-dom';
function Bateria() {
  const months = lastMonths()
  const params = useParams()
  const navigation = useNavigate()
  const [lista, setLista] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState()
  const [valor, setValor] = useState(0)

  const [subLoading, setSubLoading] = useState(false)
  moment.locale('pt-br');
  useEffect(() => {

    moment.locale('pt-br');
    getBateriaByDate(params.date ? params.date : new Date())
    // eslint-disable-next-line
  }, [params.date])
  const getBateriaByDate = async (data) => {
    setSubLoading(true)
    await api.get('/?funcao=getEstoqueByMonth&data=' + moment(data).format('YYYY-MM') + '&token=' + localStorage.getItem('token'))
      .then(async (data) => {

        let baterias = []
        setValor(data.data.sum)

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

        baterias = await baterias.sort((a, b) => { return new Date(a.lancado.replace(' ', 'T')) - new Date(b.lancado.replace(' ', 'T')) })
        setLista(baterias)
        setSubLoading(false)
        return data.data
      })
      .catch(err => {
        setSubLoading(false)
        console.error(err)
      });

  }

  // if (loading)
  //   return <Carregando />
  return (
    <div>
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Bateria</h3>

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
              navigation("/Bateria/"+moment(date).format('YYYY-MM-DD'))
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
                navigation("/Bateria/"+moment(item).format('YYYY-MM-DD'))
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
        lista.length > 0 ?
          lista.map((element, index) =>
            <ExtratoEstoque
              key={index}
              index={index}
              relatorio={lista}
              dados={element}
              valor={valor}
              anterior={lista.reduce((ac, ar, i) => index >= i ? ac + parseInt(ar.valor) : ac, valor)}
            />
          )
          : !subLoading &&
          <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>

      }

    </div>
  );
}

export default Bateria;
