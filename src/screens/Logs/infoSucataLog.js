import React, { useEffect, useState } from 'react';
import { BackButton, Carregando, NewOld } from '../../utils/componentes'
import  { api,baseURL } from '../../utils/api'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import moment from 'moment'
import './style.css'
import { useParams } from 'react-router-dom';
function Index(props) {
  let { id } = useParams()
  useEffect(() => {
    const getDados = async () =>
      await api.get(`/?funcao=getLogsById&id=${id}&token=${localStorage.getItem('token')}`)
        .then(async (data) => {
          data.data[0].dados = JSON.parse(data.data[0].dados)

          setDados(data.data[0].dados.olddata)
          setNewData(data.data[0].dados.newdata)
          setOldData(data.data[0].dados.olddata)
          setFuncao(data.data[0].funcao)
          setLancamento(data.data[0].dados.olddata.lancado)
          setAtualizacao(data.data[0].data)
          console.log(data.data[0])

        })
        .catch(err => console.log(err))
    getDados()
  }, [id])
  const [dados, setDados] = useState()
  const [funcao, setFuncao] = useState()
  const [newData, setNewData] = useState()
  const [oldData, setOldData] = useState()
  const [lancamento, setLancamento] = useState()
  const [atualizacao, setAtualizacao] = useState()
  function changeState(valor) {
    if (valor === "antigo") {
      setDados(oldData)
    } else {
      setDados(newData)
    }
  }
  if (!dados)
    return <Carregando />
  return (
    <>
      <div className="containerInfoSucata">
        <BackButton />

        <div className="containerLeft">
          <NewOld
            method={changeState}
          />
          <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <p style={{ fontSize: 22, fontWeight: 'bold', color: "#aaa" }}>{funcao === 'atualizar_entrada' ? 'Entrada de Sucata' : 'Saída de Sucata'}</p>
            <p style={{ fontSize: 18 }}>{moment(dados.data).format('DD/MM/YYYY HH:mm')}</p>
            <p style={{ fontSize: 32 }}>Peso</p>
            <p style={{ fontSize: 64, color: funcao === 'atualizar_entrada' ? '#2ecc71' : '#e74c3c' }}>
              {
                funcao === 'atualizar_entrada' ?
                  parseFloat(dados.valor).toLocaleString('pt-BR')
                  : parseFloat(dados.valor * -1).toLocaleString('pt-BR')
              }kg</p>
            {
              dados.observacao ?
                <div className="containerObservacao">
                  <p>Observações</p>
                  <p>{dados.observacao}</p>
                </div>
                : null
            }


          </div>

        </div>

      </div>
      <div className="containerRight">


        <p>Lançado em {moment(lancamento).format('DD/MM/YYYY HH:mm')}</p>
        {
          dados.imagemobs ?
            <img alt="Imagem de Observação" src={baseURL + "/uploads/imagens/" + dados.imagemobs} />
            : null
        }
        {
          dados.audioobs ?
            <AudioPlayer
              src={baseURL + "/uploads/audios/" + dados.audioobs}
              onPlay={e => console.log("onPlay")}
            />
            : null
        }

        <p>Atualizado em {moment(atualizacao).format('DD/MM/YYYY HH:mm')}</p>
      </div>
    </>
  )
}
export default Index;