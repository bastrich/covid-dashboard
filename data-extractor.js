const { Client } = require('pg')

//init libs
const axios = require('axios');
const client = new Client({
    user: 'covid',
    host: 'localhost',
    database: 'covid',
    password: 'covid',
    port: 5432,
})

//sql insert query used to store fetched data
const insertQuery = 'INSERT INTO covid_data(day, cases, deaths, country) VALUES($1, $2, $3, $4)'

console.log('Start fetching covid data');

//executing http query for covid data
axios.get('https://opendata.ecdc.europa.eu/covid19/nationalcasedeath_eueea_daily_ei/json/')
    .then(async function (response) {
        console.log('Finished fetching covid data')
        let covidData = response.data.records;
        console.log('Start saving covid data to database');
        //connect DB
        client.connect();
        //parsing fetched data and saving to DB
        for (const covidRecord of covidData) {
            try {
                await client.query(
                    insertQuery,
                    [covidRecord.year + '-' + covidRecord.month + '-' + covidRecord.day, covidRecord.cases, covidRecord.deaths, covidRecord.countriesAndTerritories]
                )
            } catch (err) {
                console.log(err.stack);
            }
        }
        console.log('Finishing saving covid data to database');
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        process.exit(0)
    });

