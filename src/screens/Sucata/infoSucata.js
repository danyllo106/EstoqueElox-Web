import React, { useEffect, useState } from 'react';
import { BackButton, Carregando } from '../../utils/componentes'
import api from '../../utils/api'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import moment from 'moment'
import './style.css'
import { useParams } from 'react-router-dom';
function Index(props) {
  let { id, funcao } = useParams()
  useEffect(() => {
    let params = new URLSearchParams();
    params.append('usuario', 'controlador_estoque');
    params.append('senha', 'kondor987456');

    const getDados = async () =>
      await api.post(`/?funcao=${funcao}&id=${id}`, params)
        .then(async (data) => {
          setDados(data.data[0])
        })
        .catch(err => console.log(err))

    getDados()
  }, [])
  const [dados, setDados] = useState()
  if (!dados)
    return <Carregando />
  return (
    <>
      <div className="containerInfoSucata">
        <BackButton />

        <div className="containerLeft">

          <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <p style={{ fontSize: 22, fontWeight: 'bold', color: "#aaa" }}>{funcao == 'getEntradaSucata' ? 'Entrada de Sucata' : 'Saída de Sucata'}</p>
            <p style={{ fontSize: 18 }}>{moment(dados.data).format('DD/MM/YYYY HH:mm')}</p>
            <p style={{ fontSize: 32 }}>Peso</p>
            <p style={{ fontSize: 64, color: funcao == 'getEntradaSucata' ? '#2ecc71' : '#e74c3c' }}>
              {
                funcao == 'getEntradaSucata' ?
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


        <p>Lançado em {moment(dados.lancado).format('DD/MM/YYYY HH:mm')}</p>
        {
          dados.imagemobs ?
            <img src={"https://www.estoque.danyllo106.com/uploads/imagens/" + dados.imagemobs} />
            : null
        }
        {
          dados.audioobs ?
            <AudioPlayer
              src={"https://estoque.danyllo106.com/uploads/audios/" + dados.audioobs}
              onPlay={e => console.log("onPlay")}
            />
            : null
        }

        <p>Última atualização em {moment(dados.atualizacao).format('DD/MM/YYYY HH:mm')}</p>
      </div>
    </>
  )
}
export default Index;