import User from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import mongoose from "mongoose";

const cookieOptions = {
	maxAge: 7 * 24 * 60 * 60 * 1000,
	httpOnly: true,
	secure: true
}

const register = async (req, res) => {
	const { fullName, email, password } = req.body;
	console.log(fullName,email,password);


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
	
	
		await user.save()
	
		user.password = undefined;
	
		const token = await user.generateJWTToken()
	
		res.cookie('token', token, cookieOptions)
	
		return res.status(201).json({
			success: true,
			message: "User registration succesfull",
			data: user
		})
	
		// ret
	} catch (error) {
		return res.status(501).send({msg:error.message})
	}

// urn res.status(400).json({
	// 	success: false,
	// 	message: error.message
	// })

}

const login = (req, res) => {

}

const logout = (req, res) => {

}

const getProfile = (req, res) => {

}

export { register, login, logout, getProfile }