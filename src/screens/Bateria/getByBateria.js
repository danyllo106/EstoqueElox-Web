import React, { useEffect, useState } from 'react';
import {  Carregando, ExtratoEstoque, BackButton, lastDays } from '../../utils/componentes'
import api from '../../utils/api'
import { useParams } from 'react-router';
import moment from 'moment';
import { FaRegCalendarAlt } from 'react-icons/fa';
function Index() {
  const dates = lastDays()
  
  const [lista, setLista] = useState([]);
  const [valor, setValor] = useState(0)
  const [referencia, setReferencia] = useState()
  const [descricao, setDescricao] = useState()
  const [marca, setMarca] = useState()
  const [dataSelecionada, setDataSelecionada] = useState()

  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  let { id } = useParams()
  useEffect(() => {
    getEstoqueByDateAndId(new Date())
    // eslint-disable-next-line
  }, [id])

  const getEstoqueByDateAndId = async (data) => {
    setSubLoading(true)

    await api.get('/?funcao=getEstoqueByDateAndId&id=' + id + '&data=' + moment(data).format('YYYY-MM-DD') + '&token=' + localStorage.getItem('token'))
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
          <input type='date'
            onChange={(date) => {
              setDataSelecionada(date.target.value)
              getEstoqueByDateAndId(date.target.value)
            }}
          />

        </div>
        {
          dates.map((item) => (
            <div
              onClick={() => {
                setDataSelecionada(item)
                getEstoqueByDateAndId(item)
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
