const express = require('express')
const createshorturlrouter = express.Router()
const env = require('dotenv')
env.config()
const shortid = require('shortid')
const validurl = require('valid-url')
const { client } = require('../database')

createshorturlrouter.get('/', async (req, res) => {
  res.status(200).send('You choosed wrong Method')
})

createshorturlrouter.post('/', async (req, res) => {
  const longurl = req.body.longurl
  const baseurl = 'http://127.0.0.1:3000'
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
        return res.status(200).json(result)
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
        return res
          .status(200)
          .json('new one created url is ' + shorturl + ' result is ' + result)
      }
    } catch (err) {
      console.log(err.message)
      return res.status(500).json('Internal server Error' + err.message)
    }
  } else {
    return res.status(401).json('Please Enter the valid URL')
  }
})

module.exports = createshorturlrouter
