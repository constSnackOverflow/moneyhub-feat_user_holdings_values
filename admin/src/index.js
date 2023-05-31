const express = require("express")
const bodyParser = require("body-parser")
const {financialsServiceUrl, investmentsServiceUrl, port} = require("config")
const {get: fetch} = require("axios")
const {get, listen, use} = express()

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
get("/all-user-holdings", async (req, res) => {
  try {
    // Requires function to retrieve and transform user holdings into required format
    const {data: investments} = await fetch(`${investmentsServiceUrl}/investments`)

    /* TODO:
        - Map over investments and return an array of objects with specified properties
        - Calculate value using product of investmentTotal and investmentPercentage
        - Retrieve holding name from financial-companies using holdingId
     */

    return investments
      .map(({
        userId: user,
        firstName,
        lastName,
        investmentTotal,
        date,
      }) => {
        const value = investmentTotal

        return {
          user,
          firstName,
          lastName,
          date,
          value,
        }
      })

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
