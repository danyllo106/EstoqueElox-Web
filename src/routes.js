import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Estoque from './screens/Estoque/index'
import Bateria from './screens/Bateria/index'
import Sucata from './screens/Sucata/index'
import Logs from './screens/Logs/index'
import { Menu } from './utils/componentes';


export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Menu>
          <Route path="/" exact component={Estoque} />
          <Route path="/Bateria" component={Bateria} />
          <Route path="/Sucata" component={Sucata} />
          <Route path="/Logs" component={Logs} />
        </Menu>
      </Switch>
    </BrowserRouter>
  )
}