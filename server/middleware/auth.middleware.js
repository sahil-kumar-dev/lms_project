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

export default isLoggedIn