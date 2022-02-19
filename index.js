console.log("App start");

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */



/**
 * Routes Definitions
 */

app.get("/getAggregatedStatistics", (req, res) => {
    let response = {
        deaths: 123,
        cases: 456
    }
    res.status(200).send(response);
});

app.get("/getDeathsData", (req, res) => {
    let response = [
        {
            day: "2020-01-20",
            number: "123"
        },
        {
            day: "2020-01-21",
            number: "1234"
        },
        {
            day: "2020-01-22",
            number: "12345"
        }
    ]
    res.status(200).send(response);
});

app.get("/getCasesData", (req, res) => {
    let response = [
        {
            day: "2020-01-20",
            number: "123"
        },
        {
            day: "2020-01-21",
            number: "1234"
        },
        {
            day: "2020-01-22",
            number: "12345"
        }
    ]
    res.status(200).send(response);
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});