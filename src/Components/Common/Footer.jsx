import React from 'react';
import { Typography, Container } from '@mui/material';

function Footer() {
  return (
    <footer>
      <Container>
        <Typography variant="body2" color="textSecondary" align="center">
          {'© '}
          Soy United
          
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
