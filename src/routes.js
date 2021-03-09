import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Estoque from './screens/Estoque/index'
import Bateria from './screens/Bateria/index'
import Sucata from './screens/Sucata/index'
import InfoSucata from './screens/Sucata/infoSucata'
import InfoBateria from './screens/Bateria/infoBateria'
import Logs from './screens/Logs/index'
import { Menu } from './utils/componentes';
import Lottie from 'react-lottie';


export default function Routes() {
  const [time, setTime] = useState(false)
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: require('./assets/eloxInicial.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setTime(true)
    }, 2500)
  }, [])
  if (!time)
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute'
      }}>
        <Lottie options={defaultOptions}
          speed={1.4}
          height={80}
          width={160} />
      </div>
    )
  return (
    <BrowserRouter basename="/EstoqueElox-Web">
      <Switch>
        <Menu>
          <Route path="/" exact component={Estoque} />
          <Route path="/Bateria" component={Bateria} />
          <Route path="/Sucata" component={Sucata} />
          <Route path="/InfoSucata/:funcao/:id" component={InfoSucata} />
          <Route path="/InfoBateria/:funcao/:id" component={InfoBateria} />
          <Route path="/Logs" component={Logs} />
        </Menu>
      </Switch>
    </BrowserRouter>
  )
}