import { Router } from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse, addLecturesToCourseId } from "../controllers/course.controller.js";
import {isLoggedIn,authorizedRoles } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = new Router()

router.route('/').get(getAllCourses)
				 .post(isLoggedIn,authorizedRoles('ADMIN'), upload.single('thumbnail'),createCourse)

router.route('/:id').get(isLoggedIn, getLecturesByCourseId)
					.put(updateCourse)
					.delete(removeCourse)
					.post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('thumbnail'),addLecturesToCourseId)
				 

export default router;