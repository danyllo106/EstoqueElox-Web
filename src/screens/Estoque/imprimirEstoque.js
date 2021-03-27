import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, PDFViewer,  Image } from '@react-pdf/renderer';
import api from '../../utils/api'
import moment from 'moment';
import logo from '../../assets/logoElox.png'
import { Carregando } from '../../utils/componentes';
const Index = () => {
  const [produtos, setProdutos] = useState([])
  useEffect(() => {
    getProdutos()
  }, [])

  const getProdutos = async () => {
    let produtos = []
    await api.get('/?funcao=getprodutos&token='+localStorage.getItem('token'))
      .then(async (data) => {
        produtos = data.data
      })
      .catch(err => console.log(err))

    await api.get('/?funcao=estoque&token='+localStorage.getItem('token'))
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
          if (entradas - saidas > 0)
            final_estoque.push({
              ...element,
              quantidade: entradas - saidas,
            })
        })

        setProdutos(final_estoque)

        return data.data
      })
      .catch(err => console.error(err));

  }




  if (produtos.length <= 0)
    return <Carregando />
  return (
      <PDFViewer style={styles.page}>
        <Document>
          <Page object-fit="cover" size="A4" style={{margin:35}}>
            <Text style={{ fontSize: 10, textAlign:'right',marginRight:80 }}>Estoque realizado em {moment().format('DD/MM/YYYY HH:mm')}</Text>
            <View style={{ justifyContent: "center", alignItems: 'center', display: 'flex', marginRight: 80,marginBottom:20 }}>
              <Image
                style={{ width: 100, }}
                src={logo}
              />
            </View>


            <View style={[styles.row, { marginBottom: 10 }]}>
              <View style={{ width: '30%' }}>
                <Text >Referência</Text>
              </View>
              <View style={{ width: '25%' }}>
                <Text >Descrição</Text>
              </View>
              <View style={{ width: '25%' }}>
                <Text >Marca</Text>
              </View>
              <View style={{ width: '20%' }}>
                <Text style={{ textAlign: 'right', paddingRight: 10 }}>Qnt</Text>
              </View>
            </View>
            {
              produtos.map((el, index) =>
                <View break={index !== 0 && index % 27 === 0 ? true : false} key={el.id} style={[styles.row, { marginTop: index !== 0 && index % 27 === 0 ? 40 : 0 }]}>
                  <View style={{ width: '30%', justifyContent: 'center', display: 'flex' }}>
                    <Text style={{ fontSize: 15 }}>{el.referencia} </Text>
                  </View>
                  <View style={{ width: '25%', justifyContent: 'center', display: 'flex' }}>
                    <Text style={{ fontSize: 15 }}>{el.descricao}</Text>
                  </View>
                  <View style={{ width: '25%', justifyContent: 'center', display: 'flex' }}>
                    <Text style={{ fontSize: 15 }}>{el.marca}</Text>
                  </View>
                  <View style={{ width: '20%', justifyContent: 'center', display: 'flex' }}>
                    <Text style={{ textAlign: 'right', paddingRight: 10 }}>{el.quantidade}</Text>
                  </View>
                </View>

              )
            }
            <Text style={{ textAlign: 'right', marginRight: 70 }}>Total: {produtos.reduce((ac, arr) => { return ac + arr.quantidade }, 0)}</Text>
          </Page>
        </Document>
      </PDFViewer>
  )
};

export default Index;

// Create styles
const styles = {

  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomCollor: 'black'
  },
  page: {
    height: '100%',
    width: '100%',
    position:'fixed',
    top:0,
    bottom:0,
    left:0,
    right:10
  }
};