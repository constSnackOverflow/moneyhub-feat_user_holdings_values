const {fetchAllUserHoldings} = require("./utils/fetchAllUserHoldings")
const express = require("express")
const bodyParser = require("body-parser")
const {financialsServiceUrl, investmentsServiceUrl, port} = require("config")
const {get: fetch} = require("axios")
const {get, listen, use, post} = express()
const {writeFile} = require("fs")

use(bodyParser.json({limit: "10mb"}))

/* TODO
    - 1) Admin: Generate a CSV formatted report showing values of all user holdings
                - CSV to contain row for each holding matching following headers:
                    - User
                    - First Name
                    - Last Name
                    - Date
                    - Holding
                        - Name of holding account given by financial-companies service
                    - Value
                        - Calculated using investmentTotal * investmentPercentage
    - 2) Investments: Expects ^ CSV report to be sent as json to /exports

*/

// Endpoint for administrator to get CSV report of all user holdings
get("/all-user-holdings", async (res) => {
  try {
    const allUserHoldings = await fetchAllUserHoldings()

    /* Initial attempt to initialise header row: Use Object.entries to map over allUserHoldings and return an array of objects with first character capitalised

        allUserHoldings
        .map(investment => Object.entries(investment)
        .map(([key, value]) => [key.charAt(0).toUpperCase() + key.slice(1), value])
        .reduce((acc, [key, value]) => ({...acc, [key]: value}), {}))
        */

    const allUserHoldingsCsv = [
      ["User", "First Name", "Last Name", "Date", "Holding", "Value"],
      ...allUserHoldings.map((investment) => [
        Object.values(investment),
      ]),
    ]
      .map(row => row.join(","))
      .join("\n")

    // write allUserHoldingsCsv to fetchAllUserHoldings CSV file

    writeFile("fetchAllUserHoldings.csv", allUserHoldingsCsv, () => {
      console.log("Fetched holding values for all users and wrote to fetchAllUserHoldings.csv")
    })

    res
      .status(200)
      .send(allUserHoldingsCsv,
      )
  } catch (error) {
    console.error(error)
    res.send(500)
  }
})


// Endpoint for CSV report to be sent as JSON to investments service on /exports
post("/exports", async (req, res) => {
  try {
    const allUserHoldings = await fetchAllUserHoldings()
    console.log("Posted holding values for all users to investments service")
    res.status(200).send(allUserHoldings)
  } catch (error) {
    console.error(error)
    res.send(500)
  }
})

// -------------------- START ADDITIONAL ENDPOINTS ----------------------------------------

// Endpoint to fetch all investments for a given user
get("/investments/:id", async ({params: {id}}, res) => {
  try {
    const {data: investmentsById} = await fetch(
      `${investmentsServiceUrl}/investments/${id}`,
    )
    res.status(200).send(investmentsById)
  } catch (error) {
    console.error(error)
    res.send(500)
  }
})

// Endpoint to fetch all financial companies
get("/financial-companies", async (req, res) => {
  try {
    const {data: financialCompanies} = await fetch(`${financialsServiceUrl}/companies`)
    res.status(200).send(financialCompanies)
  } catch (error) {
    console.error(error)
    res.send(500)
  }
})

// -------------------- END ADDITIONAL ENDPOINTS ----------------------------------------

listen(port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${port}`)
})
