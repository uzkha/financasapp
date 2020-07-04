import apiService from '../apiservice'
import ApiService from '../apiservice';

class UsuarioService extends ApiService{

    constructor(){
        super('/api/usuarios')
    }

    autenticar(credencias){
        return this.post('/autenticar', credencias)
    }

}

export default UsuarioService