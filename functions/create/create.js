const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

exports.handler = async event => {
    try {
        
        const client = new faunadb.Client({ secret: process.env.Faunadb_secret })
        const obj = JSON.parse(event.body)
        let result = await client.query(
          q.Create(q.Collection("messages"), { data: obj })
        )
        console.log("Entry Created and Inserted in Container: " + result.ref.id)
    
        
        return {
          statusCode: 200,
          body: JSON.stringify({ mess: `${result.ref.id}` }),
        }
      } catch (error) {
        return { statusCode: 500, body: error.toString() }
      }
    }
