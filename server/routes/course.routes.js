import { Router } from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = new Router()

router.route('/').get(getAllCourses)
				 .post(upload.single('thumbnail'),createCourse)

router.route('/:id').get(isLoggedIn, getLecturesByCourseId)
					.put(updateCourse)
					.delete(removeCourse)
				 

export default router;