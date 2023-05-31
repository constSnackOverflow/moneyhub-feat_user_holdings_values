const {get: fetch} = require("axios")
const {financialsServiceUrl, investmentsServiceUrl} = require("config")

const fetchAllUserHoldings = async () => {
  // Requires function to retrieve and transform user holdings into required format
  const {data: investments} = await fetch(`${investmentsServiceUrl}/investments`)
  const {data: financialCompanies} = await fetch(`${financialsServiceUrl}/companies`)

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
      holdings: [{id: holdingId, investmentPercentage}],
    }) => {
      const {name: holding} = financialCompanies.find(({id: financialCompanyId}) => financialCompanyId === holdingId)
      const value = investmentTotal * investmentPercentage

      return {
        user,
        firstName,
        lastName,
        date,
        value,
        holding,
      }
    })
}

exports.fetchAllUserHoldings = fetchAllUserHoldings
