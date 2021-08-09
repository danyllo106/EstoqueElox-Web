import React, { useEffect, useState } from 'react';
import { Carregando, ExtratoEstoque, lastDays } from '../../utils/componentes'
import api from '../../utils/api'
import moment from 'moment';
import 'moment/locale/pt-br';
import { FaRegCalendarAlt } from 'react-icons/fa';
function Index() {
  const dates = lastDays()
  const [lista, setLista] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState()
  const [valor, setValor] = useState(0)

  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  moment.locale('pt-br');
  useEffect(() => {
    moment.locale('pt-br');
    getBateriaByDate(new Date())
    // eslint-disable-next-line
  }, [])
  const getBateriaByDate = async (data) => {
    setSubLoading(true)
    await api.get('/?funcao=getEstoqueByDate&data=' + moment(data).format('YYYY-MM-DD') + '&token=' + localStorage.getItem('token'))
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

        baterias = await baterias.sort((a, b) => { return new Date(b.lancado.replace(' ', 'T')) - new Date(a.lancado.replace(' ', 'T')) })
        setLista(baterias)
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
      <h3 style={{ color: '#aaa', marginLeft: 10 }}>Bateria</h3>

      <div className="itemDataContainer">
        <div id='selectDate'>
          <FaRegCalendarAlt
            size={26}
            className="itemDataIcon"
          />
          <input type='date'
            onChange={(date) => {
              setDataSelecionada(date.target.value)
              getBateriaByDate(date.target.value)
            }}
          />

        </div>
        {
          dates.map((item) => (
            <div
              onClick={() => {
                setDataSelecionada(item)
                getBateriaByDate(item)
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
            lista.map((element, index) =>
              <ExtratoEstoque
                key={index}
                index={index}
                relatorio={lista}
                dados={element}
                valor={valor}
              />
            )
            :
            <p className='loadingMsg'>Nenhum lançamento realizado no dia</p>

      }

    </div>
  );
}

export default Index;
