import React, { useEffect, useRef, useState } from 'react';
import { Carregando, ContainerItem } from '../../utils/componentes'
import api from '../../utils/api'
import './style.css'
import { FaPrint } from 'react-icons/fa';
import logo from '../../assets/logoElox.png'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print';
import PullToRefresh from 'react-simple-pull-to-refresh';
class ComponentToPrint extends React.PureComponent {

  render() {

    return (
      <div className="page">
        <div style={{ margin: 35, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p className="dataEstoque">Estoque realizado em {moment().format('DD/MM/YYYY HH:mm')}</p>
          <div className="containerImg">
            <img
              alt="Logo Elox"
              style={{ width: 200 }}
              src={logo}
            />
          </div>
          <div className="row header" style={{ marginBottom: 10 }}>
            <div style={{ width: '30%' }}>
              <p >Referência</p>
            </div>
            <div style={{ width: '25%' }}>
              <p >Descrição</p>
            </div>
            <div style={{ width: '25%' }}>
              <p >Marca</p>
            </div>
            <div style={{ width: '20%' }}>
              <p style={{ textAlign: 'right', paddingRight: 10 }}>Qnt</p>
            </div>
          </div>
          {
            this.props.produtos.map((el, index) =>

              <div key={el.id} className={'row'} >
                <div className="rowProduto" style={{ width: '30%' }}>
                  <p>{el.referencia} </p>
                </div>
                <div className="rowProduto" style={{ width: '25%' }}>
                  <p>{el.descricao}</p>
                </div>
                <div className="rowProduto" style={{ width: '25%' }}>
                  <p>{el.marca}</p>
                </div>
                <div className="rowProduto" style={{ width: '20%', justifyContent: 'flex-end', paddingRight: 10 }}>
                  <p >{el.quantidade}</p>
                </div>
              </div>
            )
          }
          <p className="total">Total: {this.props.produtos.reduce((ac, arr) => { return ac + arr.quantidade }, 0)}</p>
        </div>
      </div>
    )
  }
}

function Index() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  //const [dados, setDados] = useState([])
  const [produtos, setProdutos] = useState([])
  const [produtosTemp, setProdutosTemp] = useState([])
  const [pesquisarValue, setPesquisarValue] = useState()
  const [peso, setPeso] = useState()
  useEffect(() => {
    getProdutos()
    getSucata()

  }, [])
  const updateDatas = async () => {
    getProdutos()
    getSucata()
  }
  const getProdutos = async () => {
    let produtos = []
    await api.get('/?funcao=getprodutos&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        produtos = data.data
      })
      .catch(err => console.log(err))

    await api.get('/?funcao=estoque&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        let saida = []
        let entrada = []

        await data.data.entrada.forEach(element => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          entrada.push(element)
        });
        await data.data.saida.forEach(element => {
          element.dados = JSON.parse(element.dados)
          element.dados.quantidade = JSON.parse(element.dados.quantidade)
          saida.push(element)
        });
        //setDados({ entrada, saida })
        let final_estoque = []
        produtos.forEach(element => {
          let saidas = saida.reduce((ac, ar) => {
            return ac + ar.dados.quantidade.reduce((soma, vetor) => {
              if (vetor.id === element.id) {
                return soma + parseInt(vetor.quantidade)
              } else {
                return soma;
              }
            }, 0)
          }, 0)
          let entradas = entrada.reduce((ac, ar) => {
            return ac + ar.dados.quantidade.reduce((soma, vetor) => {
              if (vetor.id === element.id) {
                return soma + parseInt(vetor.quantidade)
              } else {
                return soma;
              }
            }, 0)
          }, 0)

          final_estoque.push({
            ...element,
            quantidade: entradas - saidas,
          })
        })

        setProdutos(final_estoque)
        let produtos_temp = final_estoque.filter(el => { return el.quantidade > 0 })
        setProdutosTemp(produtos_temp)

        return data.data
      })
      .catch(err => console.error(err));

  }
  const getSucata = async () => {


    await api.get('/?funcao=getsucata&token=' + localStorage.getItem('token'))
      .then(async (data) => {
        let dados = data.data.entrada
        await data.data.saida.forEach(element => {
          element.valor = parseFloat(element.valor) * -1
          dados.push(element)
        });
        let peso = dados.reduce((ac, arr) => { return ac + parseFloat(arr.valor) }, 0)
        setPeso(peso)
        return peso
      })
      .catch(err => console.error(err));
  }
  const pesquisar = async (text) => {
    if (text) {
      let search = produtos.filter((el) => {
        return el.referencia.toUpperCase().includes(text.toUpperCase()) ||
          el.descricao.toUpperCase().includes(text.toUpperCase()) ||
          el.marca.toUpperCase().includes(text.toUpperCase())
      })
      search = search.sort((a, b) => { return a.quantidade < b.quantidade })
      setProdutosTemp(search)
    } else {
      let produtos_temp = produtos.filter(el => { return el.quantidade > 0 })
      setProdutosTemp(produtos_temp)
    }

  }
  if (produtosTemp.length <= 0 && !pesquisarValue)
    return <Carregando />

  return (
    <PullToRefresh onRefresh={updateDatas}>
      <div style={{ padding: 10 }}>

        <input
          placeholder={"Pesquisar... Ex: 22MPD; 60AH; KONDOR; "}
          onChange={(text) => {
            setPesquisarValue(text.target.value)
            pesquisar(text.target.value)
          }}
          className="pesquisar" />
        <div className="containerImprimir">
          <div>
            <h3 style={{ color: '#aaa' }}>Estoque</h3>
            <h3 style={{ color: '#aaa' }}><b>Bateria:</b> {produtos.reduce((ac, arr) => { return ac + arr.quantidade }, 0)}und</h3>
            <h3 style={{ color: '#aaa' }}><b>Sucata:</b> {peso.toLocaleString('pt-BR', { currency: 'BRL' })}Kg</h3>
          </div>
          <div className="imprimir" onClick={handlePrint}>
            <FaPrint fill={'#3498db'} />
            Imprimir Estoque
          </div>
          <div style={{ display: 'none' }}>
            <ComponentToPrint produtos={produtosTemp} ref={componentRef} />
          </div>

          {/* <Link to={'./ImprimirEstoque'}
          target='_blank'
          className="imprimir" >
          <FaPrint fill={'#3498db'} />
           Imprimir Estoque
      </Link> */}
        </div>


        {
          produtosTemp.map((el) =>
            <ContainerItem key={el.id} id={el.id} dados={el} />
          )
        }
        {
          produtosTemp.length === 0 ?
            <div className="nenhum">
              <p style={{ color: '#aaa' }}>Nenhum produto encontrado</p>
            </div>
            : null
        }

      </div>
    </PullToRefresh>
  );
}

export default Index;
