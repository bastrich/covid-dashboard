console.log("App start");

/**
 * Required External Modules
 */
const express = require("express");
const {engine} = require('express-handlebars');
const {Client} = require("pg");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
const client = new Client({
    user: 'covid',
    host: 'localhost',
    database: 'covid',
    password: 'covid',
    port: 5432,
})

/**
 * App Configuration
 */
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

client.connect();

const selectGlobalDataQuery = 'SELECT MAX(day)::text as date, SUM(cases) as total_cases, SUM(deaths) as total_deaths from covid_data'
const selectPerCountryDataQuery = 'SELECT country, MAX(day)::text as date, SUM(cases) as total_cases, SUM(deaths) as total_deaths from covid_data GROUP BY country'
const selectGlobalHistoricalDataQuery = 'SELECT day, day::text as date, SUM(cases) as total_cases, SUM(deaths) as total_deaths from covid_data GROUP BY day ORDER BY day'

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    const responseData = {
        Global: {}
    }

    client
        .query(selectGlobalDataQuery)
        .then(dbResultGlobalData => {
            responseData.Global = {
                'Total Cases': dbResultGlobalData.rows[0].total_cases,
                'Total Deaths': dbResultGlobalData.rows[0].total_deaths,
                Date: dbResultGlobalData.rows[0].date
            }
            res.render('ds0', {info:responseData})
        })
        .catch(e => console.error(e.stack))

    
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get('/ds1', (req, res) => {
    const responseData = {
        Countries: []
    }

    client
        .query(selectPerCountryDataQuery)
        .then(dbResultPerCountryData => {
            dbResultPerCountryData.rows.forEach(row => {
                responseData.Countries.push({
                    Country: row.country,
                    Date: row.date,
                    TotalCases: row.total_cases,
                    TotalDeaths: row.total_deaths
                })
            })
            res.render('ds1', {info:responseData})
        })
        .catch(e => console.error(e.stack))
});

app.get('/ds2', (req, res) => {
    const responseData = []

    client
        .query(selectGlobalHistoricalDataQuery)
        .then(dbResultHistoricalData => {
            dbResultHistoricalData.rows.forEach(row => {
                responseData.push({
                    Date: row.date,
                    Cases: row.total_cases,
                    Deaths: row.total_deaths
                })
            })
            res.render('ds2', {info:responseData})
        })
        .catch(e => console.error(e.stack))
});

app.get('/ds3', (req, res) => {
    const responseData = {
        Countries: []
    }

    client
        .query(selectPerCountryDataQuery)
        .then(dbResultPerCountryData => {
            dbResultPerCountryData.rows.forEach(row => {
                responseData.Countries.push({
                    Country: row.country,
                    Date: row.date,
                    TotalCases: row.total_cases,
                    TotalDeaths: row.total_deaths
                })
            })
            res.render('ds3', {info:responseData})
        })
        .catch(e => console.error(e.stack))
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
