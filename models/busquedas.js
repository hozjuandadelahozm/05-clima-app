const axios = require('axios');

class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'San José'];

    constructor() {
        // TODO: Leer DB si existe
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid'         : process.env.OPENWEATHER_KEY,
            'units'         : 'metric',
            'lang'          : 'es'
        }
    }

    async ciudad(lugar = '') {

        try {
            // peticion http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id      : lugar.id,
                nombre  : lugar.place_name,
                lng     : lugar.center[0],
                lat     : lugar.center[1],
            }))
        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ) {

        try {
            
            // intance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7d0e289f671222fda3f52ac7a3f66433`,
                params: this.paramsOpenWeather
            })

            // resp.data

            const resp = await instance.get();

            // console.log(resp.data.weather[0].description);
            // console.log(resp.data.main.temp);
            // console.log(resp.data.main.temp_min);
            // console.log(resp.data.main.temp_max);

            // return resp.data({
            //     min  : resp.data.main.temp_min,
            // })

            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
        

        } catch (error) {
            console.log( error );
        }
    }

}

module.exports = Busquedas;