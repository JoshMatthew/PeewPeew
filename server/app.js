const express = require('express');

// Init app
const app = express();

// Serve satatic files
app.use(express.static('public'));

const port = 8080 || process.env.PORT;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));