import React, {useState, useEffect} from 'react';


import { doc, deleteDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

// mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteConfirmation({openConfirm, entryId, onClose, dbName}) {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (openConfirm) {
            setOpen(true);
        }
    }, [openConfirm])
   
    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const deleteEntry = async () => {
        try {  
            // this will need to be modified for other components.
            await deleteDoc(doc(db, dbName, entryId));    
            // clear item from local storage here. 
            localStorage.clear();
            handleClose();
        }

        catch {

        }
    };
    
    return (

    <>
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete permanently?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will delete this entry permanently. This cannot be undone. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button sx ={{color:'red'}} onClick={deleteEntry}>Delete</Button>
        </DialogActions>
      </Dialog>
      
      </>)
}