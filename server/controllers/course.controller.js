import Course from "../models/course.model.js"
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const getAllCourses = async (req, res) => {

	const courses = await Course.find({}).select('-lectures')

	res.status(200).json({
		success: true,
		message: "All courses fetch",
		courses
	})
}

const getLecturesByCourseId = async (req, res) => {
	try {
		const { _id } = req.params

		const course = await Course.findById(_id)

		if (!course) {
			return res.status(400).json({
				success: false,
				message: "Course not found"
			})
		}

		res.status(200).json({
			success: true,
			message: 'Course lectures fetched successfully',
			lectures: course.lectures
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		})
	}
}

const createCourse = async (req, res) => {

	try {
		const { title, description, category, createBy } = req.body
		console.log( title, description, category, createBy );

		if (!title || !description || !category || !createBy) {
			res.status(400).json({
				success: false,
				message: "All fields are mandatory."
			})
		}

		const course = await Course.create({
			title,
			description,
			category,
			createBy
		})

		if (!course) {
			res.status(400).json({
				success: false,
				message: "Cann't create course."
			})
		}
		
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: 'LMS_PROJECT'
			})

			if (result) {
				course.thumbnail.public_id = result.public_id
				course.thumbnail.secure_url = result.secrue_url
			}

			await fs.rm('uploads/' + req.file.filename)
		}

		res.status(200).json({
			success: true,
			message: 'course created succesfully',
			course
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		})
	}
}

const updateCourse = async (req, res) => {

	try {
		const {_id} = req.params

		const course = await Course.findOneAndUpdate(
			_id,
			{
				$set:req.body
			},
			{
				runValidators:true
			}
		)

		if(!course){
			res.status(400).json({
				success:false,
				message:"Course dosen't found."
			})
		}

		res.status(200).json({
			success:false,
			message:"Course updated successfully.",
			course
		})
	} catch (error) {
		res.status(400).json({
			success:false,
			message:error.message
		})
	}
}

const removeCourse = async (req, res) => {

	try {
		
		const {id} = req.params

		console.log(id);

		const course = await Course.findById(id)

		if(!course){
			res.status(400).json({
				success:false,
				message:"Course not found."
			})
		}

		await Course.findByIdAndDelete(id)

		res.status(200).json({
			success:false,
			message:"Course deleted successfully."
		})

	} catch (error) {
		res.status(400).json({
			success:false,
			message:error.message
		})
	}

}

const addLecturesToCourseId = async (req,res,next) =>{

}


export {
	getAllCourses,
	getLecturesByCourseId,
	createCourse,
	updateCourse,
	removeCourse,
	addLecturesToCourseId
}
