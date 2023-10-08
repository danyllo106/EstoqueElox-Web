import React, { useEffect, useState } from 'react';
import { ExtratoEstoque, BackButton,  lastMonths } from '../../utils/componentes'
import {api} from '../../utils/api'
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import 'moment/locale/pt-br';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker'
function Index() {
  const months = lastMonths()

  const [lista, setLista] = useState([]);
  const [valor, setValor] = useState(0)
  const [referencia, setReferencia] = useState()
  const [descricao, setDescricao] = useState()
  const [marca, setMarca] = useState()
  const [dataSelecionada, setDataSelecionada] = useState()

  const [subLoading, setSubLoading] = useState(false)
  const { id, date } = useParams()
  const navigation = useNavigate()
  moment.locale('pt-br');
  useEffect(() => {
    moment.locale('pt-br');
    getEstoqueByDateAndId(date ? date : new Date())
    // eslint-disable-next-line
  }, [id,date])

  const getEstoqueByDateAndId = async (data) => {
    setSubLoading(true)

    await api.get('/?funcao=getEstoqueByMonthAndId&id=' + id + '&data=' + moment(data).format('YYYY-MM') + '&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        setReferencia(data.data.referencia)
        setDescricao(data.data.descricao)
        setMarca(data.data.marca)

        let baterias = []
        setValor(data.data.sum)

        await data.data.saida.forEach((element) => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          let quantidade = (element.dados.quantidade.reduce((ac, array) => { return array.id === id ? ac + parseInt(array.quantidade) : ac }, 0)) * -1

          if (element.dados.quantidade.filter(el => { return el.id === id }).length > 0) {

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

            baterias.push({
              nome: 'Entrada',
              data: element.lancado,
              valor: quantidade,
              ...element
            })
          }
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
      <BackButton />
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Referência:</b> {referencia}</p>
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Descrição:</b> {descricao}</p>
      <p style={{ color: '#aaa', marginLeft: 10 }}><b>Marca:</b> {marca}</p>
      <div className="itemDataContainer">
        <div id='selectDate'>
          <FaRegCalendarAlt
            size={26}
            className="itemDataIcon"
          />
          <DatePicker
          className='datepicker'
          style={{backgroundColor:'red'}}
            selected={dataSelecionada}
            onChange={(date) => {
              setDataSelecionada(date)
              navigation("/GetByBateria/" + id + "/" + moment(date).format('YYYY-MM-DD'))
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
                navigation("/GetByBateria/" + id + "/" + moment(item).format('YYYY-MM-DD'))
              }}
              className={moment(date).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD') ? "itemDataSelected" : "itemData"}
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

export default Index;
