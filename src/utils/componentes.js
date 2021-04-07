import React, { useEffect, useState } from 'react';
import './componentesStyles.css'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { FaBox, FaCarBattery, FaCaretLeft, FaCheck, FaCheckDouble, FaCommentAlt, FaDolly, FaImage, FaMinus, FaMusic, FaPlus, FaTimes } from "react-icons/fa";
import { Link, useHistory } from 'react-router-dom';
import Lottie from 'react-lottie'
import api from './api'
import logo from '../assets/logoElox.png'
import jwt_decode from "jwt-decode";
function selectColor(value) {
  return value >= 0 ? '#2ecc71' : '#e74c3c'
}
export function BackButton(props) {
  let history = useHistory()
  return (
    <div className="containerBackButton" onClick={() => history.goBack()}>
      <FaCaretLeft size={28} fill={'#aaa'} />
      <p>Voltar</p>
    </div>
  )
}
export function Carregando(props) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../assets/eloxCarregando.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div className="containerCarregando">
      <Lottie options={defaultOptions}
        speed={1.4}
        height={50}
        width={50} />
      <p>Carregando...</p>
    </div>
  )
}
export function ButtonMostrarMais(props) {
  return (
    <div onClick={() => props.onClick()} className="containerMostrarMais">
      <p>Mostrar mais...</p>
    </div>
  )
}
export function ContainerItem(props) {

  return (
    <div>
      {
        props.id ?
          <Link className="containerItem" to={'./GetByBateria/' + props.id}>
            <table>
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Descrição</th>
                  <th>Marca</th>
                  <th>Quant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{props.dados.referencia}</td>
                  <td>{props.dados.descricao}</td>
                  <td>{props.dados.marca}</td>
                  <td>{props.dados.quantidade}</td>
                </tr>
              </tbody>
            </table>
          </Link>
          :
          <div className="containerItem" >
            <table>
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Descrição</th>
                  <th>Marca</th>
                  <th>Quant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{props.dados.referencia}</td>
                  <td>{props.dados.descricao}</td>
                  <td>{props.dados.marca}</td>
                  <td>{props.dados.quantidade}</td>
                </tr>
              </tbody>
            </table>
          </div>

      }
    </div>
  )
}
export function Extrato(props) {
  return (
    <div className="borderContainerExtrato" >
      {
        props.index === 0 || (new Date(props.dados.data.replace(' ','T')).getDate() !== new Date(props.relatorio[props.index - 1].data.replace(' ','T')).getDate()) ?
          <div className="valorExtrato">
            <p>{moment(props.dados.data).format('DD/MM')}</p>
            <p>{parseFloat(props.relatorio.reduce((ac, array) => { return new Date(array.data.replace(' ','T')) <= new Date(props.dados.data.replace(' ','T')) ? ac + parseFloat(array.valor) : ac }, 0)).toLocaleString('pt-BR', { currency: 'BRL' })} {props.type}</p>
          </div>
          : null
      }

      <div className="containerExtrato">
        <div className="sinalExtrato"
          style={{ backgroundColor: selectColor(props.dados.valor) }}>
          {props.dados.valor >= 0 ? <FaPlus fill={"white"} /> : <FaMinus fill={"white"} />}
        </div>
        <div className="juntaExtrato" style={{ backgroundColor: selectColor(props.dados.valor) }}></div>
        <div className="containerItem containerItemExtrato"
          style={{ borderColor: selectColor(props.dados.valor) }}>
          {
            props.children
          }
        </div>
      </div>
    </div>
  )
}
export function ExtratoSucata(props) {

  return (
    <Extrato
      type={'kg'}
      {...props}
    >
      <Link className="containerExtratoSucata" to={`/InfoSucata/${props.dados.valor > 0 ? 'getEntradaSucata' : 'getSaidaSucata'}/${props.dados.id}`}>
        <table >
          <thead>
            <tr>
              <td colSpan="2" className="dateHeaderExtratoSucata">{moment(props.dados.data).format('DD/MM/YYYY HH:mm')} por {props.dados.create_nome}</td>
            </tr>
            <tr>
              <th>Descrição</th>
              <th style={{ textAlign: 'end' }}>Peso</th>
            </tr>
          </thead>
          <tbody>
            <tr className="infoExtratoSucata">
              <td>{props.dados.valor > 0 ? 'Entrada' : 'Saída'}</td>
              <td style={{ color: selectColor(props.dados.valor), textAlign: 'end' }}>{parseFloat(props.dados.valor).toLocaleString('pt-BR', { currency: 'BRL' })} kg</td>
            </tr>

          </tbody>
        </table>
        <div className="observacaoExtratoSucata">
          <div>
            {
              props.dados.imagemobs ?
                <FaImage size={16} fill={"#aaa"} />
                : null
            }
            {
              props.dados.audioobs ?
                <FaMusic size={16} fill={"#aaa"} />
                : null
            }
            {
              props.dados.observacao ?
                <FaCommentAlt size={16} fill={"#aaa"} />
                : null
            }
          </div>
          <p>Última atualização <b>{moment(props.dados.atualizacao).format('DD/MM/YYYY HH:mm')}</b> por <b>{props.dados.update_nome}</b></p>
        </div>
      </Link>
    </Extrato>
  )
}
export function ExtratoEstoque(props) {

  return (
    <Extrato
      type={'und'}
      {...props}
    >
      <Link className="containerExtratoEstoque" to={`/InfoBateria/${props.dados.valor > 0 ? 'getEntradaBaterias' : 'getSaidaBaterias'}/${props.dados.id}`}>
        <table >
          <thead>
            <tr>
              <td colSpan="2" className="dateHeaderExtratoEstoque">{moment(props.dados.lancado).format('DD/MM/YYYY HH:mm')} por {props.dados.create_nome}</td>
            </tr>
            <tr>
              <th>Descrição</th>
              <th style={{ textAlign: 'end' }}>Quant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="infoExtratoEstoque">
              <td>{props.dados.nome}</td>
              <td style={{ color: selectColor(props.dados.valor), textAlign: 'end' }}>{props.dados.valor}</td>
            </tr>

          </tbody>
        </table>
        <div className="observacaoExtratoEstoque">
          <div>
            {
              props.dados.imagemobs ?
                <FaImage size={16} fill={"#aaa"} />
                : null
            }
            {
              props.dados.audioobs ?
                <FaMusic size={16} fill={"#aaa"} />
                : null
            }
            {
              props.dados.observacao || props.dados.dados.observacoes ?
                <FaCommentAlt size={16} fill={"#aaa"} />
                : null
            }
          </div>
          <p>Última atualização {moment(props.dados.atualizacao).format('DD/MM/YYYY HH:mm')} por <b>{props.dados.update_nome}</b></p>
        </div>
      </Link>
    </Extrato>
  )
}

export function Menu(props) {
  const location = useLocation();
  const [logar, setLogar] = useState(true)
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') ? localStorage.getItem('usuario') : '')
  const [senha, setSenha] = useState('')
  const [init, setInit] = useState(true)
  const [msg, setMsg] = useState('')
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('token')) {
      api.get('/?funcao=logar&token=' + localStorage.getItem('token'))
        .then(async (data) => {
          if (data.data.status === "erro") {
            localStorage.removeItem('token')
            setLogar(true)
          } else {
            setLogar(false)
          }
          setInit(false)
        })
        .catch(err => {
          setLogar(true)
          setInit(false)
        })
    } else {
      setInit(false)
    }
  }, [location.pathname])
  const login = async (e) => {
    e.preventDefault();
    setDisabled(true)
    let params = new URLSearchParams();
    params.append('usuario', usuario);
    params.append('senha', senha);
    params.append('classe', 'logar')

    await api.post('/', params)
      .then(async (data) => {
        if (data.data.status === "success") {
          await localStorage.setItem('token', data.data.msg.token)
          const user = jwt_decode(data.data.msg.token)
          await localStorage.setItem('usuario', user.data.usuario)
          await localStorage.setItem('id', user.data.id)
          setLogar(false)
          setDisabled(false)
        } else {
          setDisabled(false)
          setMsg(data.data.msg)
          setTimeout(() => {
            setMsg('')
          }, 5000)
          setLogar(true)
          localStorage.removeItem('token')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  if (init)
    return (
      <Carregando />
    )

  if (logar)
    return (
      <>
        <div className={"containerLogin"}>
          <div>
            <img alt="Imagem de Observação" src={logo} style={{ width: 200 }} />
            <form onSubmit={login}>
              <input required disabled={disabled} placeholder="Usuário"
                autoFocus={localStorage.getItem('usuario') ? false : true}
                defaultValue={localStorage.getItem('usuario') ? localStorage.getItem('usuario') : null}
                onChange={(text) => {
                  setUsuario(text.target.value)
                }} />
              <input required disabled={disabled} type="password"
                autoFocus={localStorage.getItem('usuario') ? true : false}
                placeholder="Senha"
                onChange={(text) => {
                  setSenha(text.target.value)
                }}
              />
              <button type="submit" disabled={disabled} >{disabled ? 'Logando...' : 'Logar'}</button>
            </form>
          </div>

        </div>
        {
          msg !== '' ?
            <div className="containerToast">
              <p>{msg}</p>
              <FaTimes style={{ cursor: 'pointer' }} fill={"white"} onClick={() => setMsg('')} />
            </div>
            : null
        }

      </>
    )
  return (
    <div className="menuContainer">
      <div className="appBar">
        <Link to="/" className={location.pathname === "/" ? "selected" : null}>
          <FaBox size={16} fill={"#aaa"} />
          <p>Estoque</p>
        </Link>
        <Link to="/Bateria" className={location.pathname === "/Bateria" ? "selected" : null}>
          <FaCarBattery size={16} fill={"#aaa"} />
          <p>Bateria</p>
        </Link>
        <Link to="/Sucata" className={location.pathname === "/Sucata" ? "selected" : null}>
          <FaDolly size={16} fill={"#aaa"} />
          <p>Sucata</p>
        </Link>
        <Link to="/Logs" className={location.pathname === "/Logs" ? "selected" : null}>
          <FaCommentAlt size={16} fill={"#aaa"} />
          <p>Logs</p>
        </Link>



      </div>
      <div className="appBody">
        {props.children}
      </div>
    </div >
  )
}
export function ItemLog(props) {
  const [mensagem, setMensagem] = useState('')
  const [color, setColor] = useState('red')
  const [rota, setRota] = useState('')
  useEffect(() => {
    let msg = props.dados.usuario.charAt(0).toUpperCase() + props.dados.usuario.slice(1) + " "
    if (props.dados.classe === "bateria") {
      if (props.dados.funcao === "adicionar_entrada")
        msg += "ADICIONOU;" + props.dados.dados.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + " baterias ao estoque;"
      if (props.dados.funcao === "adicionar_saida")
        msg += "RETIROU;" + props.dados.dados.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + " baterias do estoque;" + props.dados.dados.dados.nome
      if (props.dados.funcao === "atualizar_entrada")
        msg += "ATUALIZOU;uma entrada de " + props.dados.dados.olddata.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + " baterias para "
          + props.dados.dados.newdata.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + ";"
      if (props.dados.funcao === "atualizar_saida")
        msg += "ATUALIZOU;uma saída de " + props.dados.dados.olddata.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + " baterias para "
          + props.dados.dados.newdata.dados.quantidade.reduce((ac, ar) => { return ac + parseInt(ar.quantidade) }, 0) + ";" + props.dados.dados.olddata.dados.nome
      if (props.dados.funcao === "deletar_entrada")
        msg += "DELETOU;uma entrada de baterias do estoque"
      if (props.dados.funcao === "deletar_saida")
        msg += "DELETOU;uma saída de baterias do estoque"
    } else {
      if (props.dados.funcao === "adicionar_entrada")
        msg += "ADICIONOU;" + props.dados.dados.valor + "kg de sucata ao estoque"
      if (props.dados.funcao === "adicionar_saida")
        msg += "RETIROU;" + props.dados.dados.valor + "kg de sucata do estoque"
      if (props.dados.funcao === "atualizar_entrada")
        msg += "ATUALIZOU;uma entrada de " + props.dados.dados.olddata.valor + "kg de sucata para "
          + props.dados.dados.newdata.valor + "kg"
      if (props.dados.funcao === "atualizar_saida")
        msg += "ATUALIZOU;uma saída de " + props.dados.dados.olddata.valor + "kg de sucata para "
          + props.dados.dados.newdata.valor
      if (props.dados.funcao === "deletar_entrada")
        msg += "DELETOU;um entrada de sucata do estoque"
      if (props.dados.funcao === "deletar_saida")
        msg += "DELETOU;uma saída de sucata do estoque"
    }
    if (props.dados.funcao.includes('adicionar'))
      if (props.dados.funcao.includes('entrada')) {
        setRota(props.dados.classe === "bateria" ? './InfoBateria/getEntradaBaterias/' + props.dados.dados.id : './InfoSucata/getEntradaSucata/' + props.dados.dados.id)
        setColor('#2ecc71')
      } else {
        setRota(props.dados.classe === "bateria" ? './InfoBateria/getSaidaBaterias/' + props.dados.dados.id : './InfoSucata/getSaidaSucata/' + props.dados.dados.id)
        setColor('#f39c12')
      }
    if (props.dados.funcao.includes('atualizar')) {
      setColor('#2980b9')
      setRota(props.dados.classe === "bateria" ? './InfoBateriaLog/' + props.dados.id : './InfoSucataLog/' + props.dados.id)
    }
    if (props.dados.funcao.includes('deletar')) {
      setColor('#e74c3c')
      if (props.dados.funcao.includes('entrada')) {
        setRota(props.dados.classe === "bateria" ? './InfoBateria/getEntradaBaterias/' + props.dados.dados.id : './InfoSucata/getEntradaSucata/' + props.dados.dados.id)
      } else {
        setRota(props.dados.classe === "bateria" ? './InfoBateria/getSaidaBaterias/' + props.dados.dados.id : './InfoSucata/getSaidaSucata/' + props.dados.dados.id)
      }
    }
    setMensagem(msg)
  }, [props.dados])

  async function checkLog(){
    await api.get('/?funcao=checkLog&id='+props.dados.id+'&token='+localStorage.getItem('token'))
      .then(async (data) => {
        console.log(data)
        return data.data
      })
      .catch(err => console.error(err));

  }
  return (
    <>
      {
        props.index === 0 || new Date(props.logs[props.index - 1].data.replace(' ','T')).getDate() !== new Date(props.logs[props.index].data.replace(' ','T')).getDate() ?
          <div className="containerDateLogs">
            <p>{moment(props.dados.data).format("DD/MM")}</p>
          </div>

          : null
      }
      <Link to={rota}
        onClick={()=>checkLog('ss')}
        className="logContainer"
        style={{ borderLeftColor: color }}>
        <strong style={{ color: '#aaa' }}>#{props.dados.classe}</strong>
        <p>Data: {moment(props.dados.data).format("DD/MM/YYYY HH:mm")}</p>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

          <p>
            {mensagem.split(';')[0]}
            <b style={{ color: color }}> {mensagem.split(';')[1]} </b>
            {mensagem.split(';')[2]}
            {
              mensagem.split(';')[3] ?
                <b style={{ color: color }}>{" - " + mensagem.split(';')[3]}</b>
                : null
            }
          </p>
          {
            props.dados.status === "pendente" ?
              <FaCheck fill={'#aaa'} />
              :
              <FaCheckDouble fill={'#2980b9'} />
          }

        </div>
      </Link>
    </>
  )
}
export function NewOld(props) {
  const [dados, setDados] = useState('antigo')
  return (
    <div className="containerNewOld">
      <div className={dados === "antigo" ? "selected" : null} onClick={() => {
        setDados('antigo')
        props.method('antigo')
      }}>
        <p>Dados Antigos</p>
      </div>
      <div className={dados === "novo" ? "selected" : null} onClick={() => {
        setDados('novo')
        props.method('novo')
      }}>
        <p>Dados Novos</p>
      </div>
    </div>
  )
}