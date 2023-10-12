import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
	fullName: {
		type: 'String',
		required: [true, 'Name is required'],
		minLength: [5, 'Name must be at least 5 charcter'],
		maxLength: [50, 'Name should be less than 50 charcter']
	},
	email: {
		type: 'String',
		required: [true, 'Email is required'],
		lowercase: true,
		trim: true,
		unique: true,
		match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Please enter valid email."]
	},
	password: {
		type: 'String',
		required: [true, 'Password is required'],
		minLength: [8, 'Password must be at least 8 charcters'],
		select: false
	},
	avatar: {
		public_id: {
			type: 'String',
			default: 'User'
		},
		secure_url: {
			type: 'String',
			default: 'User'
		},
	},
	role: {
		type: 'String',
		enum: ['USER', 'ADMIN'],
		default: 'USER'
	},
	forgotPasswordToken: String,
	forgotPasswordExpiry: Date,
}, {
	timestamps: true,
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	this.password = bcrypt.hash(this.password, 10)
})


userSchema.methods = {
	generateJWTToken: async function () {
		return await jwt.sign(
			{ id: this._id, email: this.email, subscription: this.subscription },
			"secret",
			{ expiresIn: '24hr' }

		)
	}
}
const User = model('User', userSchema)

export default User