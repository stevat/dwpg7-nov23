import express from 'express';
import TicketService from './TicketService.js';

const app = express();
app.use(express.json());
const port = 300
    
app.post('/bookTickets', (req, res) => {
    let tixQuery = req.body;
    
    console.log("incoming query: ", tixQuery)



})

app.listen(port, () => {
    console.log(`Ticket Server App Listening on port ${port}`);
})
