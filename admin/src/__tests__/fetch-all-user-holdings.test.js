const app = require("../index.js")
const request = require("supertest")
const {expect} = require("chai")

describe("GET", () => {
  describe("GET /all-user-holdings", () => {
    const endpoint = request(app).get("/all-user-holdings")
    it("should return a 200 status code", async () => {
      try {
        const response = await endpoint
        expect(response.status).to.equal(200)
      } catch (err) {
        console.log(err)
        throw err
      }
    })
    it("should have the text property in the response body", async () => {
      try {
        const response = await endpoint
        expect(response).to.have.property("text")
      } catch (err) {
        console.log(err)
        throw err
      }
    })
    it("should have substring of column values present in response.text", async () => {
      try {
        const {response: {text}} = endpoint
        expect(text).to.include("Last Name,Date,Holding,Value")
      } catch (err) {
        console.log(err)
        throw err
      }
    })
  })
})
