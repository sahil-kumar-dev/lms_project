import Course from "../models/course.model.js"

const getAllCourses = async (req,res)=>{
	
	const courses = await Course.find({}).select('-lectures')

	res.status(200).json({
		success: true,
		message:"All courses fetch",
		courses
	})
} 

const getLecturesByCourseId = async (req,res)=>{
	try {
		const {id} = req.params

		const course = await Course.findById(id)

		if(!course){
			return res.status(400).json({
				success:false,
				message:"Course not found"
			})
		}

		res.status(200).json({
			success:true,
			message:'Course lectures fetched successfully',
			lectures:course.lectures
		})
	} catch (error) {
		res.status(400).json({
			success:false,
			message:error.message
		})
	}
}

export {
	getAllCourses,
	getLecturesByCourseId
}
