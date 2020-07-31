import React from 'react'
import {withRouter} from 'react-router-dom' 
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentoService from '../../app/service/lancamentoService'
import * as messages from '../../components/toastr'
import LocalStorageService from '../../app/service/localStorageService'

class CadastroLancamentos extends React.Component{

    state ={
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    //executado apos o render
    //sobrescrever
    componentDidMount(){
        const params = this.props.match.params;
        if(params.id){
            this.service.obterPorId(params.id)
            .then(response => {
                this.setState( {...response.data})  //spred operator action script
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
        }
        
    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
        
        //operador destructor
        const {descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = {descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id}

        this.service.salvar(lancamento)
        .then(response => {
            this.props.history.push('/consulta-lancamentos');
            messages.mensagemSucesso('Lançamento cadastrado com sucesso!');
        }).catch(error => {
            messages.mensagemErro(error.response.data);
        })
    }

    atualizar = () => {
               
        //operador destructor
        const {descricao, valor, mes, ano, tipo, id, usuario, status } = this.state;
        const lancamento = {descricao, valor, mes, ano, tipo, id, usuario, status}

        this.service.atualizar(lancamento)
        .then(response => {
            this.props.history.push('/consulta-lancamentos');
            messages.mensagemSucesso('Lançamento atualizado com sucesso!');
        }).catch(error => {
            messages.mensagemErro(error.response.data);
        })
    }

    //alterar os campos dos states, com metodo gen
    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name] : value })
    }

    render (){

        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title="Cadastro de Lançamento">
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descricao: *">
                            <input id="inputDescricao" type="text" name="descricao" className="form-control" 
                            value={this.state.descricao} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="text" className="form-control" 
                            name="ano" value={this.state.ano} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMeses" lista={meses}  className="form-control"
                            name="mes" value={this.state.mes} onChange={this.handleChange} /> 
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" className="form-control"
                            name="valor" value={this.state.valor} onChange={this.handleChange} />
                        </FormGroup>
                    </div> 
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" lista={tipos}  className="form-control"
                            name="tipo" value={this.state.tipo} onChange={this.handleChange} />                   
                        </FormGroup>
                    </div>   
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status:">
                            <input type="text" className="form-control"  disabled 
                            name="status" value={this.state.status}  />                  
                        </FormGroup>
                    </div>                      
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button onClick={this.submit} className="btn btn-success">Salvar</button>
                        <button onClick={this.atualizar} className="btn btn-primary">Atualizar</button>
                        <button onClick={e => this.props.history.push('/consulta-lancamentos')}className="btn btn-danger">Cancelar</button>
                    </div>
                </div>                
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);