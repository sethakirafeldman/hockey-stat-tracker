import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function AlertSnack({openSnack, onClose, type, text}) {
  
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

    return (
    <>
      <Snackbar open = {openSnack} autoHideDuration = {3000} onClose = {onClose} anchorOrigin ={{horizontal: 'right', vertical: 'top'}}>
        <Alert onClose={onClose} severity = {type} sx={{ width: '100%' }}>
          {text}
        </Alert>
      </Snackbar>
    </>
    )
};