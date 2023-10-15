import app from './app.js'
import connectionToDB from './config/dbConnection.js';
import cloudnary from 'cloudinary'

const PORT = process.env.PORT || 5050;

cloudnary.v2.config({
	cloud_name:'dh48phjnt',
	api_key:'764245472864325',
	api_secret:'OK0b2TwpfFKEzU_6xUR8gTNpct0'
})

app.listen(PORT, async () => {
	await connectionToDB()
	console.log('Server is running on http://localhost:' + PORT);
})