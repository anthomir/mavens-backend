import {Inject, Res, Service} from '@tsed/common';
import {MongooseModel} from '@tsed/mongoose';
import sgMail from '@sendgrid/mail';
import {Course} from '../models/Course';
import {FilterQuery} from 'mongoose';
import fs from 'fs';

sgMail.setApiKey(String(process.env.SENDGRID_API));

@Service()
export class ChapterService {
	@Inject(Course)
	private Course: MongooseModel<Course>;
	async find(
		filter: FilterQuery<Course>,
		take: number,
		skip: number,
		sortBy?: string | undefined
	) {
		const courses = await this.Course.find(filter)
			.limit(take)
			.skip(skip)
			.sort(sortBy);

		if (courses.length < 0) {
			throw new Error('No course found');
		}

		return courses;
	}

	async findById(id: string) {
		const course = await this.Course.findById(id);

		if (!course) {
			throw new Error('No course found');
		}

		return course;
	}

	async create(payload: Course) {
		const course = await this.Course.create(payload);
		return course;
	}

	async postFile(res: Res, file: any) {
		if (!file)
			return res
				.status(400)
				.json({success: false, err: 'File should be of type Png or Jpeg'});

		const filename = file.filename;
		const mimetype = file.mimetype.substring(file.mimetype.indexOf('/') + 1);

		fs.rename(
			`./public/uploads/${filename}`,
			`./public/uploads/${filename}.${mimetype}`,
			function (err) {
				if (err)
					return res.status(500).json({message: 'An unexpected error occured'});
			}
		);
		return `${process.env.PRODUCTION_URL}/uploads/${filename}.${mimetype}`;
	}
}
