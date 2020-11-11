import React,{useState, useEffect} from 'react';
import {Formik,Form,Field,} from 'formik';
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
  }),
);
export default function Home(){
  const classes = useStyles();
  interface mydata {
      ref: object
      ts: number
      data: {
        detail: string,
        
      }
    }
    const [mydata, setData] = useState<null | mydata[]>();
    const [fetchdata, setFetchdata] = useState(false);
    const [updatingData, setUpdatingData] = useState(undefined)
    const [updateData, setUpdateData] = useState(false)
    const [openCreate, setOpenCreate] = useState(false);

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
      initialValues={{detail:""}}
      onSubmit={(value,action)=>{
        fetch(`/.netlify/functions/create`,{
          method:'post',
          body: JSON.stringify(value),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            detail:""
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
        id="detail"
        label="detail"
        name="detail"
        type="text"
        required
        />
        <button type="submit">create</button>
        <button onClick={handleClose}>close</button>
      </Form>
    )}</Formik>
    
    )
    const updateBody = (
      <Formik
      initialValues={{detail:updatingData !== undefined ? 
      updatingData.data.detail: "",
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
            detail:""
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
        <div>
          <button type="button" onClick={handleOpen}>
            create message
          </button>
          
          <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openCreate}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
      <div className={classes.paper}>
        {createBody}
        
      </div>
        
        </Modal>
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