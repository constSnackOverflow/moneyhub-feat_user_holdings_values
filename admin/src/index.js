const express = require("express")
const bodyParser = require("body-parser")
const {investmentsServiceUrl, port} = require("config")
const {get: fetch} = require("axios")
const {get, listen, use} = express()

use(bodyParser.json({limit: "10mb"}))

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

listen(port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${port}`)
})
