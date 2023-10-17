import jwt from 'jsonwebtoken'

const isLoggedIn = async (req,res,next) =>{
	const {token} = req.cookies

	if(!token){
		return res.status(400).json({
			success:false,
			message:"Unauthenticated, please login again."
		})
	}

	const userDetails =await jwt.verify(token,'secret')

	req.user = userDetails

	next()
}

const authorizedRoles = (...roles) => async (req,res,next) =>{
	
	const currentRoles = req.user.roles

	if(!roles.includes(currentRoles)){
		return res.status(403).json({
			success:false,
			message:"You do not have to acces this course."
		})
	}

	next()
}


export {
	isLoggedIn,
	authorizedRoles
}