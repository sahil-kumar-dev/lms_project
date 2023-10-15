import User from "../models/user.models.js";
import bcrypt from 'bcryptjs'
import AppError from "../utils/error.utils.js";
import mongoose from "mongoose";

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
	
	
		await user.save()
	
		user.password = undefined;
	
		const token = await user.generateJWTToken()
		
		console.log(token);

		res.cookie('token', token, cookieOptions)
	
		return res.status(201).json({
			success: true,
			message: "User registration succesfull",
			data: user
		})
	
	} catch (error) {
		return res.status(501).json({
			success:false,
			message:error.message
		})
	}

}

const login =async (req, res) => {

	const {email,password} = req.body

	try {
		const user =await User.findOne({email}).select('+password')
	
		if(!user || !await user.comparePassword(password)){
			return res.status(501).json({
				success:false,
				message:"Email or password dosen't match."
			})
		}
	
		const token = await user.generateJWTToken()

		console.log(token);

		user.password = undefined
	
		res.cookie('token',token,cookieOptions)
	
		res.status(200).json({
			success:true,
			message:'User loggedIn successfully.',
			user
		})
		
	} catch (error) {
		return res.status(500).json({
			success:false,
			message:error.message
		})
	}

	
}

const logout = (req, res) => {

	res.cookie('token',null,{
		secrue:true,
		maxAge:0,
		httpOnly:true
	})

	res.status(200).json({
		success:true,
		message:"User logged out succesfully."
	})
	
}

const getProfile = async (req, res) => {

	
	try {
		const userId = req.user.id;
		const user = await User.findById(userId)
		
		res.status(200).json({
			success:true,
			messages:"User details",
			user
		})
	} catch (error) {
		res.status(500).json({
			success:false,
			message:"failed to get user details."
		})
	}

}

export { register, login, logout, getProfile }