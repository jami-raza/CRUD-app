import React,{useState, useEffect} from 'react';
import {Formik,Form,Field,} from 'formik';
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    body:{
      maxWidth: '500px',
      margin: 'auto'
    },
    title:{
      fontFamily:'Arial',
      letterSpacing:'25px',
      color:'#0913A6',
      fontSize:'48px',
      textAlign:'center',
      fontWeight:'bolder',
    },
    subtilte:{
      textAlign:'center',
      fontFamily:'Arial',
      wordSpacing:'14px',
      marginTop:'-35px',
      padding:'0 30px 50px 15px',
      color:'#AB0416',
      fontWeight:'bold',
      
    },
    
  }),
);
export default function Home(){
  const classes = useStyles();
  interface mydata {
      ref: object
      ts: number
      data: {
        detail: string,
        name: string,
        email:string,
      }
    }
    const [mydata, setData] = useState<null | mydata[]>();
    const [fetchdata, setFetchdata] = useState(false);
    const [updatingData, setUpdatingData] = useState(undefined)
    const [updateData, setUpdateData] = useState(false)
    const [openCreate, setOpenCreate] = useState(false);
    const [loading, setLoading] = useState(false)
    const handleOpen = () => {
      setOpenCreate(true);
    };
  
    const handleClose = () => {
      setOpenCreate(false);
    };
    const handleOpenUpdate = () => {
      setUpdateData(true);
    };
  
    const handleCloseUpdate = () => {
      setUpdateData(false);
    };
    useEffect(()=>{
      fetch(`/.netlify/functions/read`)
      .then(response => response.json())
      .then(data => {
        setData(data.data)
        console.log(data.data)
      })
      .catch(e =>{
        console.log(e)
      })
        
        
    },[fetchdata])
    const updatemessage = (id:string) => {
      var updateData = mydata.find(messa=>messa.ref["@ref"].id === id)
      setUpdatingData(updateData)
    }

    const deletemessage = (deletedata:mydata)=>{
      fetch(`/.netlify/functions/delete`,{
        method: 'post',
        body: JSON.stringify({id:deletedata.ref["@ref"].id})
      })
      .then(response => response.json())
      .then(data => {
        setFetchdata(data)
      })
    }

    const createBody = (
      <Formik
      initialValues={{detail:"",name:"",email:""}}
      onSubmit={(value,action)=>{
        
        fetch(`/.netlify/functions/create`,{
          method:'post',
          body: JSON.stringify(value),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            detail:"",
            name:"",
            email:""
          },
        })
        setFetchdata(false)
        handleClose()
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        
        <Field
        as={TextField}
        id="name"
        label="Your Name"
        name="name"
        type="text"
        required
        />
        <Field
        as={TextField}
        id="email"
        label="Your Email"
        name="email"
        type="email"
        required
        />
        <br/>
        <Field
        as={TextareaAutosize}
        rowsMin={10}
        id="detail"
        label="detail"
        name="detail"
        type="text"
        placeholder="Message"
        style={{width:"500px",marginTop:"10px"}}
        />
        <br/>
        <button type="submit">create</button>
        
      </Form>
    )}</Formik>
    
    )
    const updateBody = (
      <Formik
      initialValues={{detail:updatingData !== undefined ? 
      updatingData.data.detail: "",
      name:updatingData !== undefined ? 
      updatingData.data.name: "",
      email:updatingData !== undefined ? 
      updatingData.data.email: "",
      }}
      onSubmit={(value,action)=>{
        fetch(`/.netlify/functions/update`,{
          method:'post',
          body: JSON.stringify({
            detail: value.detail,
            id:updatingData.ref["@ref"].id,
          }),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            detail:"",
            name:"",
            email:""
          },
        })
        setFetchdata(false)
        handleCloseUpdate()
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        <Field
        as={TextField}
        id="name"
        label="name"
        name="name"
        type="text"
        
        />
        <Field
        as={TextField}
        id="email"
        label="Update email"
        name="email"
        type="text"
        
        />
        <br/>
        <Field
        as={TextareaAutosize}
        id="detail"
        label="detail"
        name="detail"
        type="text"
        
        />
        
        <button type="submit">update</button>
        <button type="button" onClick={handleCloseUpdate}>close</button>
      </Form>
    )}</Formik>
      )
      return(
        <div className={classes.body}>
          <h2 className={classes.title}>CRUD</h2>
          <p className={classes.subtilte}>Create Read Update Delete</p>

          <Box m={1} p={1}>
          {createBody}
          </Box>
          
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={updateData}
        onClose={handleCloseUpdate}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
      <div className={classes.paper}>
        {updateBody}
        
      </div>
        
        </Modal>
       
        {mydata === null || mydata === undefined ? (
    <div>
      <CircularProgress/>
    </div>
  ):mydata.length >= 1 ? (
    
    <div>
      <div>
      
        {mydata.map((ind,i)=>(
           
          
          
        
          <div key={i}>
            <p>
           
              {ind.data.detail}
              </p>
              <p>
              {ind.data.name}
              </p>
              <p>
                {ind.data.email}
              </p>
            <button onClick={()=>{
            handleOpenUpdate()
            updatemessage(ind.ref["@ref"].id)
            }}>update</button>
            <button onClick={()=>{
              deletemessage(ind)
            }}>Delete</button>
          </div>
          
        ))}
      </div>
    </div>
  ):(
    <div>No data</div>
  )}
        </div>
      )
  }

 /* */