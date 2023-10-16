import cloudnary from 'cloudinary';
import User from "../models/user.models.js";
import sendEmail from '../utils/sendmail.utils.js';
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const cookieOptions = {
	maxAge: 7 * 24 * 60 * 60 * 1000,
	httpOnly: true,
}

const register = async (req, res) => {
	const { fullName, email, password } = req.body;

	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are mandatory."
			})
		}


		const userExists = await User.findOne({ email })

		if (userExists) {
			return res.status(400).json({
				success: false,
				message: "User already exits."
			})
		}

		const user = await User.create({
			fullName,
			email,
			password
		})

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User registration failed"
			})
		}

		//File upload

		if (req.file) {
			try {
				const result = await cloudnary.v2.uploader.upload(req.file.path, {
					folder: "lms",
					width: 250,
					height: 250,
					gravity: 'faces',
					crop: 'fill'
				})

				if (result) {
					user.avatar.public_id = result.public_id;
					user.avatar.secure_url = result.secure_url;

					//Remove file from server

					fs.rm(`uploads/${req.file.filename}`)
				}
			} catch (error) {
				return res.status(400).json({
					success: true,
					message: error.message
				})
			}
		}


		await user.save()

		user.password = undefined;

		const token = await user.generateJWTToken()


		res.cookie('token', token, cookieOptions)

		return res.status(201).json({
			success: true,
			message: "User registration succesfull",
			data: user
		})

	} catch (error) {
		return res.status(501).json({
			success: false,
			message: error.message
		})
	}

}

const login = async (req, res) => {

	const { email, password } = req.body

	try {
		const user = await User.findOne({ email }).select('+password')

		if (!user || !await user.comparePassword(password)) {
			return res.status(501).json({
				success: false,
				message: "Email or password dosen't match."
			})
		}

		const token = await user.generateJWTToken()

		console.log(token);

		user.password = undefined

		res.cookie('token', token, cookieOptions)

		res.status(200).json({
			success: true,
			message: 'User loggedIn successfully.',
			user
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		})
	}


}

const logout = (req, res) => {

	res.cookie('token', null, {
		secrue: true,
		maxAge: 0,
		httpOnly: true
	})

	res.status(200).json({
		success: true,
		message: "User logged out succesfully."
	})

}

const getProfile = async (req, res) => {


	try {
		const userId = req.user.id;
		const user = await User.findById(userId)

		res.status(200).json({
			success: true,
			messages: "User details",
			user
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "failed to get user details."
		})
	}

}

const forgotPassword = async (req, res) => {

	const { email } = req.body

	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Please enter email."
		})
	}

	const user = await User.findOne({ email })

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Account dosen't exists."
		})

	}

	const resetToken = await user.generatePasswordResetToken()

	await user.save()

	const resetPasswordUrl = `http://localhost:8080/api/v1/user/reset-password/${resetToken}`

	const subject = "Reset Password"
	const message = `You can reset your password by clicking on this link <a href ="${resetPasswordUrl}">${resetPasswordUrl}</a>`

	try {
		await sendEmail(email, subject, message)

		res.status(200).json({
			success: true,
			message: `Reset Password link has been send to ${email} successfully}`
		})
	} catch (error) {
		user.forgotPasswordExpiry = undefined
		user.forgotPasswordToken = undefined

		await user.save()
		return res.status(400).json({
			success:false,
			message:"failed"
		})
	}

}

const resetPassword = async (req,res) => {
	const {resetToken} = req.params

	const {password} = req.body

	const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	
	const user = await User.findOne({
		forgotPasswordToken,
		forgotPasswordExpiry:{$gt:Date.now()}
	})

	if(!user){
		return res.status(400).json({
			success:false,
			message:"Link expired."
		})
	}

	user.password = password

	user.forgotPasswordToken = undefined
	user.forgotPasswordExpiry = undefined

	user.save()

	res.status(200).json({
		success:true,
		message:"Password changed successfully"
	})
}

const changePassword = async (req,res) =>{

	const {oldPassword, newPassword} = req.body
	const userId = req.user.id

	const user = await User.findById(userId).select('+password')
	
	if(!oldPassword || !newPassword){
		return res.status(400).json({
			success:false,
			message:"all field are madontary."
		})
	}
	
	if(oldPassword == newPassword){
		return res.status(400).json({
			success:false,
			message:"New password can't be same as old password."
		})
	}
	
	const isPasswordValid = await bcrypt.compare(oldPassword,user.password)

	if(!isPasswordValid){
		return res.status(400).json({
			success:false,
			message:"Old password is incorrect."
		})
	}

	user.password = newPassword

	await user.save()

	user.password = undefined

	res.status(200).json({
		success:true,
		message:"Password changed successfully."
	})
}

// const updateUser = (req,res) =>{

// 	const {fullName} = req.body

// 	const {id} = req.user.id

// 	const user = User.findById(id)

// 	if(!user){
// 		return res.status(500).json({
// 			success:false,
// 			message:"User does not exists."
// 		})
// 	}

// 	if(req.fullName){
// 		user.fullName = fullName
// 	}

// 	if(req.file){
// 		await 
// 	}

// }

export { 
	getProfile,
	login, 
	logout, 
	register, 
	forgotPassword, 
	resetPassword, 
	changePassword
};
