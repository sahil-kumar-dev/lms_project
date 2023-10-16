import app from './app.js'
import connectionToDB from './config/dbConnection.js';
import cloudnary from 'cloudinary'

const PORT = process.env.PORT || 5050;

cloudnary.v2.config({
	cloud_name:process.env.CLOUD_NAME,
	api_key:process.env.CLOUD_API_KEY,
	api_secret:process.env.CLOUD_SECRET
})

app.listen(PORT, async () => {
	await connectionToDB()
	console.log('Server is running on http://localhost:' + PORT);
})