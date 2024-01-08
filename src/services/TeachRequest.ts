import {TeachRequest} from './../models/TeachRequest';
import {Inject, OnInit, Res, Service} from '@tsed/common';
import {MongooseModel} from '@tsed/mongoose';
import {FilterQuery} from 'mongoose';
import {Category} from 'src/models/Category';
import {User} from 'src/models/User';

@Service()
export class TeachRequestService {
	@Inject(TeachRequest)
	private TeachRequest: MongooseModel<TeachRequest>;

	async find(filter: FilterQuery<TeachRequest>) {
		const all = await this.TeachRequest.find(filter);
		return all;
	}

	async findLatestByUser(user: User) {
		try {
			const latestTeachRequest = await this.TeachRequest.findOne({
				createdBy: user._id,
			})
				.sort({createdAt: -1})
				.limit(1);
			return latestTeachRequest;
		} catch (error) {
			console.error('Error finding latest TeachRequest:', error);
			throw error;
		}
	}

	async create(payload: any) {
		const teachRequest = await this.TeachRequest.create(payload);
		return teachRequest;
	}
}
