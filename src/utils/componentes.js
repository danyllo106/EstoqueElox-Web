import React, { useEffect, useState } from 'react';
import './componentesStyles.css'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { FaBox, FaCarBattery, FaCaretLeft, FaCheck, FaCheckDouble, FaCommentAlt, FaDolly, FaImage, FaMinus, FaMusic, FaPlus, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie'
import {api} from './api'
import logo from '../assets/logoElox.png'
import jwt_decode from "jwt-decode";
function selectColor(value) {
  return value >= 0 ? '#2ecc71' : '#e74c3c'
}

export function lastDays() {
  moment.locale('pt-br');
  const getDaysArray = function (s, e) { for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };
  const daylist = getDaysArray(new Date(new Date().setDate(new Date().getDate() - 5)), new Date());
  const list = daylist.reverse()
  return list
}
export function lastMonths() {
  moment.locale('pt-br');

  const getDaysArray = function (s, e) {
    for (var a = [], d = new Date(s); d <= e; d.setMonth(d.getMonth() + 1)) {
      a.push(new Date(d));
    } return a;
  };
  const daylist = getDaysArray(new Date(new Date().setMonth(new Date().getMonth() - 5)), new Date());
  const list = daylist.reverse()
  return list
}


export function BackButton(props) {
  let history = useNavigate()
  return (
    <div className="containerBackButton" onClick={() => history(-1)}>
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
          <Link className="containerItem" to={'/GetByBateria/' + props.id+"/"+moment(new Date()).format('YYYY-MM-DD')}>
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
        props.index === 0 || (new Date(props.dados.data.replace(' ', 'T')).getDate() !== new Date(props.relatorio[props.index - 1].data.replace(' ', 'T')).getDate()) ?
          <div className="valorExtrato">
            <p style={{ fontWeight: 'bold' }}>TOTAL</p>
            <p>{parseFloat(props.valor).toLocaleString('pt-BR', { currency: 'BRL' })} {props.type}</p>
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
    // <Extrato
    //   type={'kg'}
    //   {...props}
    // >
    <Link className="containerExtratoSucata" style={{ borderLeft: `5px solid ${selectColor(props.dados.valor)}` }} to={`/InfoSucata/${props.dados.valor > 0 ? 'getEntradaSucata' : 'getSaidaSucata'}/${props.dados.id}`}>
      <table >
        <thead>
          <tr>
            <td className="dateHeaderExtratoSucata">{moment(props.dados.data).format('DD/MM/YYYY HH:mm')} por {props.dados.create_nome}</td>
            <td style={{ textAlign: 'end' }}>Peso</td>
            <td style={{ textAlign: 'end' }}>Saldo</td>
          </tr>

        </thead>
        <tbody>
          <tr className="infoExtratoSucata">
            <td style={{ width: '60%' }}>{props.dados.valor > 0 ? 'Entrada' : 'Saída'}{props.dados.imagemobs && <FaImage size={16} fill={"#aaa"} />}{props.dados.audioobs && <FaMusic size={16} fill={"#aaa"} />}</td>
            <td style={{ width: '20%', color: selectColor(props.dados.valor), textAlign: 'end' }}>{parseFloat(props.dados.valor).toLocaleString('pt-BR', { currency: 'BRL' })} kg</td>
            <td style={{ width: '20%', color: selectColor(props.anterior), textAlign: 'end' }}>{parseFloat(props.anterior).toLocaleString('pt-BR', { currency: 'BRL' })} kg</td>
          </tr>
          {
            props.dados.observacao &&
            <tr>
              <td colSpan={3} style={{ color: '#aaa' }}>{props.dados.observacao}</td>
            </tr>
          }
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Link>

    // </Extrato>
  )
}
export function ExtratoEstoque(props) {

  return (
    // <Extrato
    //   type={'und'}
    //   {...props}
    // >
    <Link className="containerExtratoSucata" style={{ borderLeft: `5px solid ${selectColor(props.dados.valor)}` }} to={`/InfoBateria/${props.dados.valor > 0 ? 'getEntradaBaterias' : 'getSaidaBaterias'}/${props.dados.id}`}>
      <table >
        <thead>
          <tr>
            <td className="dateHeaderExtratoSucata">{moment(props.dados.data).format('DD/MM/YYYY HH:mm')} por {props.dados.create_nome}</td>
            <td style={{ textAlign: 'end' }}>Quant</td>
            <td style={{ textAlign: 'end' }}>Total</td>
          </tr>
        </thead>
        <tbody>
          <tr className="infoExtratoSucata">
            <td style={{ width: '60%',whiteSpace:'break-spaces' }}>{props.dados.nome}{props.dados.imagemobs && <FaImage size={16} fill={"#aaa"} />}{props.dados.audioobs && <FaMusic size={16} fill={"#aaa"} />}</td>
            <td style={{ width: '20%', color: selectColor(props.dados.valor), textAlign: 'end' }}>{props.dados.valor}</td>
            <td style={{ width: '20%', color: selectColor(props.anterior), textAlign: 'end' }}>{props.anterior}</td>
          </tr>
          {
            props.dados.observacao &&
            <tr>
              <td colSpan={3} style={{ color: '#aaa' }}>{props.dados.observacao}</td>
            </tr>
          }
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Link>
    // </Extrato>
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
        <div data-theme={'dark'} className={"containerLogin"}>
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
    <div data-theme={'dark'} className="menuContainer">
      <div className="appBar">
        <Link to="/" className={location.pathname === "/" ? "selected" : null}>
          <FaBox size={16} fill={"#aaa"} />
          <p>Estoque</p>
        </Link>
        <Link to={"/Bateria/"+moment(new Date()).format('YYYY-MM-DD')} className={location.pathname.includes("/Bateria") ? "selected" : null}>
          <FaCarBattery size={16} fill={"#aaa"} />
          <p>Bateria</p>
        </Link>
        <Link to={"/Sucata/"+moment(new Date()).format('YYYY-MM-DD')} className={location.pathname.includes("/Sucata") ? "selected" : null}>
          <FaDolly size={16} fill={"#aaa"} />
          <p>Sucata</p>
        </Link>
        <Link to={"Logs/"+moment(new Date()).format('YYYY-MM-DD')} className={location.pathname.includes("/Logs") ? "selected" : null}>
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
        setRota(props.dados.classe === "bateria" ? '/InfoBateria/getEntradaBaterias/' + props.dados.dados.id : '/InfoSucata/getEntradaSucata/' + props.dados.dados.id)
        setColor('#2ecc71')
      } else {
        setRota(props.dados.classe === "bateria" ? '/InfoBateria/getSaidaBaterias/' + props.dados.dados.id : '/InfoSucata/getSaidaSucata/' + props.dados.dados.id)
        setColor('#f39c12')
      }
    if (props.dados.funcao.includes('atualizar')) {
      setColor('#2980b9')
      setRota(props.dados.classe === "bateria" ? '/InfoBateriaLog/' + props.dados.id : '/InfoSucataLog/' + props.dados.id)
    }
    if (props.dados.funcao.includes('deletar')) {
      setColor('#e74c3c')
      if (props.dados.funcao.includes('entrada')) {
        setRota(props.dados.classe === "bateria" ? '/InfoBateria/getEntradaBaterias/' + props.dados.dados.id : '/InfoSucata/getEntradaSucata/' + props.dados.dados.id)
      } else {
        setRota(props.dados.classe === "bateria" ? '/InfoBateria/getSaidaBaterias/' + props.dados.dados.id : '/InfoSucata/getSaidaSucata/' + props.dados.dados.id)
      }
    }
    setMensagem(msg)
  }, [props.dados])

  async function checkLog() {
    await api.get('/?funcao=checkLog&id=' + props.dados.id + '&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        return data.data
      })
      .catch(err => console.error(err));

  }
  return (
    <>
      {
        // props.index === 0 || new Date(props.logs[props.index - 1].data.replace(' ', 'T')).getDate() !== new Date(props.logs[props.index].data.replace(' ', 'T')).getDate() ?
        //   <div className="containerDateLogs">
        //     <p>{moment(props.dados.data).format("DD/MM")}</p>
        //   </div>

        //   : null
      }
      <Link to={rota}
        onClick={() => checkLog('ss')}
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