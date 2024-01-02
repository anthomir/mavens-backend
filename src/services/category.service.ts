import {Inject, OnInit, Res, Service} from '@tsed/common';
import {MongooseModel} from '@tsed/mongoose';
import sgMail from '@sendgrid/mail';
import {Course} from '../models/Course';
import {FilterQuery} from 'mongoose';
import fs from 'fs';
import {Category} from 'src/models/Category';

@Service()
export class CategoryService implements OnInit {
	async $onInit(): Promise<void | Promise<any>> {
		const titles = [
			'Mathematics',
			'Science',
			'Programming',
			'Language',
			'Arts',
			'History',
			'Business',
			'Health',
			'Music',
			'Cooking',
			'Design',
			'Photography',
			'Fitness',
		];
		const count = await this.Category.find();

		if (count.length != 0) {
			return;
		}

		for (let i = 0; i < count.length; i++) {
			await this.Category.create({title: titles[i]});
		}
	}
	@Inject(Category)
	private Category: MongooseModel<Category>;
	async find() {
		const courses = await this.Category.find();

		if (courses.length < 0) {
			throw new Error('No categories found');
		}

		return courses;
	}

	async create(payload: any) {
		const category = await this.Category.create(payload);
		return category;
	}
}