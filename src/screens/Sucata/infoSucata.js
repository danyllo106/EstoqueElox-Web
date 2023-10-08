import React, { useEffect, useState } from 'react';
import { BackButton, Carregando } from '../../utils/componentes'
import  {api, baseURL } from '../../utils/api'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import moment from 'moment'
import './style.css'
import { useParams } from 'react-router-dom';
function Index(props) {
  let { id, funcao } = useParams()
  useEffect(() => {
    const getDados = async () =>
      await api.post(`/?funcao=${funcao}&id=${id}&token=${localStorage.getItem('token')}`)
        .then(async (data) => {
          setDados(data.data[0])
        })
        .catch(err => console.log(err))

    getDados()
  }, [id, funcao])
  const [dados, setDados] = useState()
  if (!dados)
    return <Carregando />
  return (
    <>
      <div className="containerInfoSucata">
        <BackButton />

        <div className="containerLeft">

          <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <p style={{ fontSize: 22, fontWeight: 'bold', color: "#aaa" }}>{funcao === 'getEntradaSucata' ? 'Entrada de Sucata' : 'Saída de Sucata'}</p>
            <p style={{ fontSize: 18 }}>{moment(dados.data).format('DD/MM/YYYY HH:mm')}</p>
            <p style={{ fontSize: 32 }}>Peso</p>
            <p style={{ fontSize: 64, color: funcao === 'getEntradaSucata' ? '#2ecc71' : '#e74c3c' }}>
              {
                funcao === 'getEntradaSucata' ?
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


        <p>Lançado em <b>{moment(dados.lancado).format('DD/MM/YYYY HH:mm')}</b> por <b>{dados.create_nome}</b></p>
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

        <p>Última atualização em <b>{moment(dados.atualizacao).format('DD/MM/YYYY HH:mm')}</b> por <b>{dados.update_nome}</b></p>
      </div>
    </>
  )
}
export default Index;