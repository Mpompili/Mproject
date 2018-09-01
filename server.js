const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Hello Yes'));

const port = process.env.PORT || 5000; // for heroku || local 

app.listen(port, () => console.log(`server running on port ${port}`));