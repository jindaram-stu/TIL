const express = require('express');
const app = express();
const morgan = require('morgan');

const users = [
    {id : 1, name : 'alice'},
    {id : 2, name : 'bek'},
    {id : 3, name : 'chris'}
]

app.use(morgan('dev'));

app.get('/users', (req, res) => {
    res.json(users)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
})

module.exports = app;