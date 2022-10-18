import React from 'react';
import { TextField, Button, ButtonGroup } from '@mui/material';

export default function SignUp() {
    return (
        <>
        <h2>Sign Up</h2>
        <TextField id="outlined-basic" label="Username" variant="outlined" required  />
        <TextField id="outlined-basic" label="Password" variant="outlined" required type ="password"  />
        <TextField id="outlined-basic" label="Confirm Password" variant="outlined" required type ="password"  />

        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
            <Button color ="primary">Register</Button>
            <Button color ="secondary">Cancel</Button>
        </ButtonGroup>
        </>
    )
}