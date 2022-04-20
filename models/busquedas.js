const axios = require('axios');

class Busquedas {

    historial = [ 'Tegucigalpa', 'Madrid', 'San José' ];

    constructor() {
        // TODO: Leer DB si existe
    }

    get paramsMapbox() {
        return {
            'access_token' : 'pk.eyJ1IjoiaG96anVhbmRhMTEiLCJhIjoiY2wyNzBxeHZhMDZnaDNqbWp5ajUwYWFnaSJ9.JyzTOcEnTFTO_-vpqOntFg',
            'limit'        : 5,    
            'language'     : 'es'
        }
    }

    async ciudad( lugar = '' ) {

        try {
            // peticion http
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();
            console.log(resp.data);

            return[]; // retornar los lugares

        } catch (error) {
            return[];
        }
       

    }

}

module.exports = Busquedas;