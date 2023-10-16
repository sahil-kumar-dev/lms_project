import { model, Schema } from "mongoose"

const courseSchema = new Schema({
	title: {
		type: String,
		required:[true,'Title is required.'],
		minLength:[8,'Title must be atleast 8 characters.'],
		maxLength:[50,'Title must be less than 50 charcters.']
	},
	description: {
		type: String,
		required:[true,'Description is required.'],
		minLength:[8,'Description must be atleast 8 charcters.'],
		maxLength:[200,'Description should be less than 200 charcters.']
	},
	category: {
		type: String,
		required:[true,'Catergory is required.']
	},
	thumbnail: {
		public_id: {
			type: String,
			required:true
		},
		secure_url: {
			type: String,
			required:true
		}
	},
	lectures: {
		title: String,
		description: String,
		lecture: {
			public_id: {
				type: String
			},
			secure_url: {
				type: String
			}
		}

	},
	numberOfLectures: {
		type: Number,
		default:0
	},
	createBy: {
		type: String,
		required:true
	}
}, {
	timestamps:true
})

const Course = model('Course',courseSchema)

export default Course