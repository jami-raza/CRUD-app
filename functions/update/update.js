const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

exports.handler = async event => {
    try {
        
      if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" }
      }

        const client = new faunadb.Client({ secret: process.env.Faunadb_secret })
        const obj = JSON.parse(event.body)
        let result = await client.query(
        q.Update(q.Ref(q.Collection("messages"), obj.id), {
            data: { detail: obj.detail },
            })
        )
        
    
        
        return {
          statusCode: 200,
          body: JSON.stringify({id: `${result.ref.id}`}),
        }
      } catch (error) {
        return { statusCode: 500, body: error.toString() }
      }
    }
