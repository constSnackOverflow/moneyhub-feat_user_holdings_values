const {request} = require("supertest")
const app = require("../index")
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
  })
})
