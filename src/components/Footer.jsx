import React from 'react';

import { Container, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer() {
    return(
        <footer>
        <Container>
            <Box maxWidth = "lg">
                <CopyrightIcon></CopyrightIcon>Stat Tracker 2022
            </Box>
        </Container>
        </footer>
    )
}