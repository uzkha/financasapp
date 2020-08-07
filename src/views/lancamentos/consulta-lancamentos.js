import React from 'react'
import {withRouter} from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTables'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'
import * as messages from '../../components/toastr'
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button'


class ConsultaLancamentos extends React.Component{


    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos : []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
       
        if (!this.state.ano){
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service.consultar(lancamentoFiltro)
            .then(resposta =>{
                const lista = resposta.data;
                if(lista.length < 1){
                    messages.mensagemAlerta('Não encontrado nenhum lançamento.')
                }
                this.setState({lancamentos: lista})})
            .catch(error => {console.log(error)})
    }

    editar = (id) => {
        
        this.props.history.push(`/cadastro-lancamentos/${id}`);

    }


    abrirConfirmacao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento})
    }
    
    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.seState( {lancamentos: lancamentos, showConfirmDialog: false } );
                messages.mensagemSucesso('Lançamento deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o lançamento.')
            })
    }

    cancelarDelecao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {} })
    }
    
    preparaFormularioCadastro = () =>{
        this.props.history.push('/cadastro-lancamentos');
    }


    alterarStatus = (lancamento, status) => {
        this.service.alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos
                const index = lancamentos.indexOf(lancamento)
                if(index !== -1){
                    lancamento['status'] = status
                    lancamentos[index] = lancamento
                    this.setState({lancamento})
                }
                messages.mensagemSucesso('Mensagem atualizada com sucesso!');
            })
    }

    render(){

        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label ="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label ="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} className="p-button-secondary"/>
            </div>
        )


        return(
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="text" className="form-control" id="inputAno" value={this.state.ano} onChange={e => this.setState({ano: e.target.value})}
                                       aria-describedby="anoHelp" placeholder="Digite o Ano"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mes: ">
                                <SelectMenu className="form-control" value={this.state.mes} onChange={e => this.setState({mes: e.target.value})} lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descricao">
                                <input type="text" className="form-control" id="inputDescricao" value={this.state.descricao} onChange={e => this.setState({descricao: e.target.value})}
                                       aria-describedby="descricaoHelp" placeholder="Digite a Descrição"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo Lancamento: ">
                                <SelectMenu className="form-control" value={this.state.tipo} onChange={e => this.setState({tipo: e.target.value})} lista={tipos} />
                            </FormGroup>

                            <button type="button" onClick={this.buscar} className="btn btn-success"><i className="pi pi-search"></i> Buscar</button>
                            <button type="button" onClick={this.preparaFormularioCadastro} className="btn btn-danger"><i className="pi pi-plus"> Cadastrar</i></button>

                        </div>
                  </div>
              </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="bs-component">
                        <LancamentosTable lancamentos={this.state.lancamentos}
                                         deleteAction={this.abrirConfirmacao}
                                         editarAction={this.editar} 
                                         alterarStatus={this.alterarStatus} />
                    </div>
                </div>
            </div>
            <div>
                <Dialog header="Confirmar Exclusão" visible={this.state.showConfirmDialog}
                style={{width: '50vw'}} modal={true} footer={confirmDialogFooter}
                onHide={() => this.setState({showConfirmDialog: false})}>
                    Confirma a exclusão do lançamento?
                </Dialog>
            </div>
          </Card>  
        )
    }

}

export default withRouter(ConsultaLancamentos);