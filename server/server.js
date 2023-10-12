import app from './app.js'
import connectionToDB from './config/dbConnection.js';

const PORT = process.env.PORT || 5050;

app.listen(PORT, async () => {
	await connectionToDB()
	console.log('Server is running on http://localhost:' + PORT);
})