import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Estoque from './screens/Estoque/index'
import Bateria from './screens/Bateria/index'
import Sucata from './screens/Sucata/index'
import Logs from './screens/Logs/index'
import { Menu } from './utils/componentes';


export default function Routes() {
  return (
    <BrowserRouter basename="/EstoqueElox-Web">
      <Switch>
        <Menu>
          <Route path="/EstoqueElox-Web/" exact component={Estoque} />
          <Route path="/EstoqueElox-Web/Bateria" component={Bateria} />
          <Route path="/EstoqueElox-Web/Sucata" component={Sucata} />
          <Route path="/EstoqueElox-Web/Logs" component={Logs} />
        </Menu>
      </Switch>
    </BrowserRouter>
  )
}