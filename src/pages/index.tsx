import React,{useState,useEffect} from "react"
import {Formik} from 'formik'




export default function Home() {
  
  interface mydata {
    ref: Object
    data: {message:string}
    ts: number
  }
  const [mydata, setData] = useState<null | mydata[]>();
  const [fetchData, setFetchData] = useState(false)
  useEffect(()=>{
    ;(async () => {
      await fetch("/.netlify/functions/read")
        .then(res => res.json())
        .then(data => {
          setData(data)
        })
    })()
    
  },[fetchData])
  const createBody = (
    <Formik
       initialValues={{ message:'' }}
       validate={values => {
        const errors = {};
        if (!values.message) {
          errors.message = 'Required';
      }
         
         
         return errors;
       }}
       onSubmit={(values) => {
         console.log(values);
         fetch(`/.netlify/functions/create`,{
           method: 'post',
           body: JSON.stringify(values),
         })
         
           setFetchData(true)
           
           
         
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         
         /* and other goodies */
       }) => (
         <form onSubmit={handleSubmit}>
           <input
             type="text"
             name="message"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.message}
           />
           {errors.message && touched.message && errors.message}
           
           <button type="submit" >
             Submit
           </button>
         </form>
       )}
     </Formik>
  )
  return (
      
       <div>
     <h1>Anywhere in your app!</h1>
     <div>
       {createBody}
       </div>
     
       
         {mydata === null || mydata === undefined ? (
           <div>loading</div>

         ):
         mydata.length >= 1 ?
         (
         <div>
           {mydata.map((name,i)=>(
           
             <div key={i}>
               {name.data.message}
             </div>
           
         ))}
         </div>
         ):(
           <div>you have no contacts</div>
         )
         
       
      }
  </div>
  )
}
