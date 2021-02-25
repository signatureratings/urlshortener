const express = require('express')
const getshorturlrouter = express.Router()
const env = require('dotenv')
env.config()
const shortid = require('shortid')
const validurl = require('valid-url')
const { client } = require('../database')

getshorturlrouter.get('/:urlcode', async (req, res) => {
  const urlcode = req.params.urlcode
  try {
    await client.connect()
    await client.db('sairam').command({ ping: 1 })
    console.log('connected')
    const dbcollection = client.db('sairam').collection('shorturl')
    const result = await dbcollection.findOne({ urlCode: urlcode })
    if (result) {
      let count = result.ClickCount
      const filter = { urlCode: urlcode }
      const updatedata = {
        $set: {
          ClickCount: count + 1,
        },
      }
      const uresult = await dbcollection.updateOne(filter, updatedata)
      console.log('succesful url redirection to: ', result.longURL)
      return res.redirect(result.longURL)
    } else {
      return res.status(400).json("The short url doesn't exists in our system.")
    }
  } catch (err) {
    console.log(err.message)
    return res.status(401).json('Internal Server Error ' + err.message)
  }
})

module.exports = getshorturlrouter
