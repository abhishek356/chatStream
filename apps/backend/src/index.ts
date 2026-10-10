import Anthropic from "@anthropic-ai/sdk";
import  dotenv from  'dotenv';
import express from 'express';
import {chatRouter} from  './chat.router.js';

const app = express();
app.use(express.json());
app.use('/api/v1',chatRouter);

app.listen(3000,() =>{
    console.log('Server is running on port 3000');
})