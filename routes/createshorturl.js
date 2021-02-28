const express = require('express')
const createshorturlrouter = express.Router()
const env = require('dotenv')
env.config({
  path: '../.env',
})

const shortid = require('shortid')
const validurl = require('valid-url')
const { client } = require('../database')

createshorturlrouter.post('/', async (req, res) => {
  const longurl = req.body.longurl
  const baseurl = process.env.BASEURL
  if (!validurl.isUri(baseurl)) {
    return res.send(401).json('Internal server Error. please comeback Later')
  }
  if (validurl.isUri(longurl)) {
    try {
      await client.connect()
      await client.db('sairam').command({ ping: 1 })
      console.log('connected')
      const dbcollection = client.db('sairam').collection('shorturl')
      const result = await dbcollection.findOne({ longURL: longurl })
      if (result) {
        console.log(result)
        return res.status(203).json(result.shortURL)
      } else {
        let urlCode = shortid.generate()
        let shorturl = baseurl + '/' + urlCode
        const data = {
          longURL: longurl,
          shortURL: shorturl,
          urlCode: urlCode,
          ClickCount: 0,
          CreatedAt: Date(),
        }
        const result = await dbcollection.insertOne(data)
        return res.status(200).json(shorturl)
      }
    } catch (err) {
      // console.log(err.message)
      return res.status(500).json('Internal server Error' + err.message)
    }
  } else {
    return res.status(401).json('Please Enter the valid URL')
  }
})

module.exports = createshorturlrouter
