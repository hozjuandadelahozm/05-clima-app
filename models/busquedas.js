const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPatch = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){

        this.historial = this.historial.map( capitalize => {
            return capitalize.toUpperCase();
        })

        return this.historial
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
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
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
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            })

            // resp.data

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc    :   weather[0].description,
                min     :   main.temp_min,
                max     :   main.temp_max,
                temp    :   main.temp
            }
        

        } catch (error) {
            console.log( error );
        }
    }

    agregarHistorial( lugar = '' ){

        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Grabar en DB
        this.guaardarDB();
    }

    guaardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPatch, JSON.stringify( payload ))
    }

    leerDB(){

        // Debe existir

        // const info readFileSync... patch... {encoding:'utf-8'}

        const info = fs.readFileSync( this.dbPatch, { encoding:'utf-8' } );

        const data = JSON.parse( info );

        this.historial = data.historial;

    }


}

module.exports = Busquedas;