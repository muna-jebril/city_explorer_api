'user strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT= process.env.PORT || 3000;
const server= express();
server.use(cors());
server.listen(PORT,() =>{
    console.log(`lisning on port ${PORT}`);
})
server.get('/',(request , response)=>{
response.status(200).send('it works');
})
 