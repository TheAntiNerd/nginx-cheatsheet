const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express(),
	port = process.env.PORT;

app.get(`/`, (req, res) => {
	res.json({
		status: 'active',
		uuid: uuidv4(),
	});
});

app.listen(port, () => console.log(`Listening to port ${port}`));
