import React, { useEffect, useState } from 'react';
import { BackButton, Carregando, ContainerItem,NewOld } from '../../utils/componentes'
import api from '../../utils/api'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import moment from 'moment'
import './styleBateria.css'
import { useParams } from 'react-router-dom';
function Index(props) {
  let { id } = useParams()
  useEffect(() => {
    const getDados = async () =>
      await api.get(`/?funcao=getLogsById&id=${id}&token=${localStorage.getItem('token')}`)
        .then(async (data) => {
          let dados = data.data[0]
          
          dados.dados=JSON.parse(dados.dados)
          dados.dados.newdata.dados=JSON.parse(dados.dados.newdata.dados)
          dados.dados.newdata.dados.quantidade=JSON.parse(dados.dados.newdata.dados.quantidade)
          dados.dados.olddata.dados=JSON.parse(dados.dados.olddata.dados)
          dados.dados.olddata.dados.quantidade=JSON.parse(dados.dados.olddata.dados.quantidade)
          
          let info = dados.dados.olddata.dados
          let produtos = info.quantidade;
          setInfo(info)
          setDados(info)
          setProdutos(produtos)
          setOldData(dados.dados.olddata)
          setNewData(dados.dados.newdata)
          setLancamento(data.data[0].dados.olddata.lancado)
          setAtualizacao(data.data[0].data)
        })
        .catch(err => console.log(err))

    getDados()
  }, [id])
  const [info, setInfo] = useState()
  const [dados, setDados] = useState()
  const [newData,setNewData]=useState()
  const [oldData,setOldData]=useState()
  const [produtos, setProdutos] = useState([])
  const [lancamento,setLancamento]=useState()
  const [atualizacao,setAtualizacao]=useState()
  function changeState(valor){
    if(valor==="antigo"){
      setDados(oldData)

      setInfo(oldData.dados)
      setProdutos(oldData.dados.quantidade)
    }else{
      setDados(newData)
      setInfo(newData.dados)
      setProdutos(newData.dados.quantidade)
    }
  }
  if (produtos.length <= 0 )
    return <Carregando />
  return (
    <>
      <div className="containerInfoBateria">
        <BackButton />
        <div className="containerItems">
        <NewOld
            method={changeState}
          />
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
              <ContainerItem key={el.id}  dados={el} />
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


        <p>Lançado em {moment(lancamento).format('DD/MM/YYYY HH:mm')} </p>
        {
          dados.imagemobs ?
            <img alt={"Imagem de Observação"} src={"https://www.estoque.danyllo106.com/uploads/imagens/" + dados.imagemobs} />
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

        <p>Atualizado em {moment(atualizacao).format('DD/MM/YYYY HH:mm')}</p>
      </div>

    </>
  )
}
export default Index;