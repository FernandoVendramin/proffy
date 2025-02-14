import { Response, Request } from 'express';

import convertHourToMinutes from './../utils/convertHourToMinutes';
import database from './../database/connection';

import { ScheduleItem } from './../models/scheduleItem';

export default class ClassesController {
    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({ error: 'Missing filters to search classes' });
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await database('classes')
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;
        const transaction = await database.transaction();

        try {
            const insertedUsersIds = await transaction('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
            const user_id = insertedUsersIds[0];

            const insertedClassesId = await transaction('classes').insert({
                subject,
                cost,
                user_id
            });
            const class_id = insertedClassesId[0];

            const classSchedule = schedule.map(
                (scheduleItem: ScheduleItem) => ({
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                })
            );

            await transaction('class_schedule').insert(classSchedule);

            await transaction.commit();

            return response.status(201).send();
        } catch (err) {
            await transaction.rollback();

            return response
                .status(400)
                .json({ error: 'Unexpected error while creating new class.' });
        }
    }
}
