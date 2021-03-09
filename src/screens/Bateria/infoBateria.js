import React, { useEffect, useState } from 'react';
import { BackButton, Carregando, ContainerItem } from '../../utils/componentes'
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
          let dados = data.data[0]
          let info = JSON.parse(data.data[0].dados)
          let produtos = JSON.parse(info.quantidade);
          console.log(info)
          setInfo(info)
          setDados(dados)
          setProdutos(produtos)
        })
        .catch(err => console.log(err))

    getDados()
  }, [])
  const [info, setInfo] = useState()
  const [dados, setDados] = useState()
  const [produtos, setProdutos] = useState([])
  if (produtos.length <= 0)
    return <Carregando />
  return (
    <>
      <div className="containerInfoBateria">
        <BackButton />
        <div className="containerItems">
          <div>
            <p>{moment(info.data_).format('DD/MM/YYYY HH:mm')}</p>
            <p style={{ fontSize: 28, fontWeight: 'bold', color: '#aaa' }}>{info.nome}</p>
            <p style={{ fontSize: 18, color: '#aaa' }}>{info.municipio}-{info.uf}</p>
            <p style={{ fontSize: 22, fontWeight: "bold", color: '#e74c3c' }}>Pedido: {info.pedido}</p>
            <p style={{ fontSize: 22, fontWeight: "bold", color: '#e74c3c' }}>Peso: {produtos.reduce((acum, arr) => { return acum + (parseInt(arr.quantidade * arr.peso)) }, 0)} kg</p>
            <p style={{ fontSize: 22, fontWeight: "bold", color: '#e74c3c' }}>Quantidade: {produtos.reduce((acum, arr) => { return acum + parseInt(arr.quantidade) }, 0)}</p>
            {
              info.observacoes ?
                <div className="containerObservacao">
                  <p>Observações</p>
                  <p>{info.observacoes}</p>
                </div>
                : null
            }

          </div>
          {
            produtos.map((el) =>
              <ContainerItem key={el.id} dados={el} />
            )
          }

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