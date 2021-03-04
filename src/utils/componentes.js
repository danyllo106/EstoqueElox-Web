import React from 'react';
import './componentesStyles.css'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { FaBox, FaCarBattery, FaCommentAlt, FaDolly, FaImage, FaMinus, FaMusic, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie'

function selectColor(value) {
  return value >= 0 ? '#2ecc71' : '#e74c3c'
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
  if (props.dados.quantidade === 0)
    return null
  return (
    <div className="containerItem">
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
  )
}
export function Extrato(props) {
  return (
    <div className="borderContainerExtrato" >
      {
        props.index === 0 || (new Date(props.dados.data).getDate() !== new Date(props.relatorio[props.index - 1].data).getDate()) ?
          <div className="valorExtrato">
            <p>{moment(props.dados.data).format('DD/MM')}</p>
            <p>{parseFloat(props.relatorio.reduce((ac, array) => { return new Date(array.data) <= new Date(props.dados.data) ? ac + parseFloat(array.valor) : ac }, 0)).toLocaleString('pt-BR', { currency: 'BRL' })} {props.type}</p>
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
      <div className="containerExtratoSucata">
        <table >
          <thead>
            <tr>
              <td colSpan="2" className="dateHeaderExtratoSucata">{moment(props.dados.data).format('DD/MM/YYYY HH:mm')}</td>
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

          </div>
          <p>Última atualização: {moment(props.dados.atualizacao).format('DD/MM/YYYY HH:mm')}</p>
        </div>
      </div>
    </Extrato>
  )
}
export function ExtratoEstoque(props) {
  return (
    <Extrato
      type={'und'}
      {...props}
    >
      <div className="containerExtratoEstoque">
        <table >
          <thead>
            <tr>
              <td colSpan="2" className="dateHeaderExtratoEstoque">{moment(props.dados.lancado).format('DD/MM/YYYY HH:mm')}</td>
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
          </div>
          <p>Última atualização:{moment(props.dados.atualizacao).format('DD/MM/YYYY HH:mm')}</p>
        </div>
      </div>
    </Extrato>
  )
}
export function Menu(props) {
  const location = useLocation();

  return (
    <div className="menuContainer">
      <div className="appBar">
        <Link to="/EstoqueElox-Web/" className={location.pathname === "/" ? "selected" : null}>
          <FaBox size={16} fill={"#aaa"} />
          <p>Estoque</p>
        </Link>
        <Link to="/EstoqueElox-Web/Bateria" className={location.pathname === "/Bateria" ? "selected" : null}>
          <FaCarBattery size={16} fill={"#aaa"} />
          <p>Bateria</p>
        </Link>
        <Link to="/EstoqueElox-Web/Sucata" className={location.pathname === "/Sucata" ? "selected" : null}>
          <FaDolly size={16} fill={"#aaa"} />
          <p>Sucata</p>
        </Link>
        <Link to="/EstoqueElox-Web/#" className={location.pathname === "/Logs" ? "selected" : null}>
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
