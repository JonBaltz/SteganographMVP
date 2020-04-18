const express = require('express');
const path = require('path');
const app = express();

const port = 9000;

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));