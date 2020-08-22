import React from 'react';
import { render } from '@testing-library/react';
import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.css'
import Rotas from './rotas'
import Navbar from '../components/navbar'

import 'toastr/build/toastr.min.js'
import 'toastr/build/toastr.css'

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ProvedorAutenticacao from './provedorAutenticacao';

class App extends React.Component {
    
  render(){
    return(
     <ProvedorAutenticacao>
        <Navbar />
        <div className="container">          
            <Rotas />
        </div>
     </ProvedorAutenticacao>
    )
  }
}

export default App

/*
class AppTeste extends React.Component {
  
    state = {
      nome : '',
      numero1 : null,
      numero2 : null,
      resultado : null
    }

    somar = () => {
        const resultado = parseInt(this.state.numero1) + parseInt(this.state.numero2)
        this.setState({resultado : resultado })
    }

    render(){
      return (
        <div>
          <label>Nome: </label>
          <input type="text" value={this.state.nome} onChange={(e) => this.setState({nome: e.target.value})} />      
          O nome digitado foi: {this.state.nome}
          <br></br>

          <label>Número 1: </label>
          <input type="text" value={this.state.numero1} onChange={(e) => this.setState({numero1: e.target.value})} />
          <label>Número 2 </label>
          <input type="text" value={this.state.numero2} onChange={(e) => this.setState({numero2: e.target.value})} />
          <button onClick={this.somar}>Somar</button>
          O resultado é: {this.state.resultado}

        </div>
      )
    }
}

export default AppTeste;
*/