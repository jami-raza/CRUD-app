const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

exports.handler = async event => {
    try {
        
        const client = new faunadb.Client({ secret: process.env.Faunadb_secret })
        
        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("details_by_title"))),
            q.Lambda(["name", "ref"], q.Get(q.Var("ref")))
          )
        )
        console.log("Entry Created and Inserted in Container: " + result.data)
    
        
        return {
          statusCode: 200,
          body: JSON.stringify(result.data),
        }
      } catch (error) {
        return { statusCode: 500, body: error.toString() }
      }
    }
