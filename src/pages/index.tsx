import React,{useState} from "react"
import {Formik} from 'formik'

interface data {
  message:string,
}

export default function Home() {
  const [mydata, setData] = useState("");

  return (
  
       <div>
     <h1>Anywhere in your app!</h1>
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
           body: JSON.stringify(values)
         })
         .then(response => response.json())
         .then(data => {
           setData(data);
           
           console.log('Data' + JSON.stringify(data))
         })
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
       <div>{mydata.mess}</div>
  </div>
  )
}
