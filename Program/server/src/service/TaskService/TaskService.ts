// Core
import {ApolloError} from "apollo-server-express";

// Args
import {CreateTaskInput, DeleteTaskInput, DeleteTaskResponse, UpdateTaskInput} from "./args";

// Types
import {Errors} from "../../types";

// Models
import {Task} from "../../models/Task";

class TaskService {
    async create({listId, title}: CreateTaskInput): Promise<Task> {
        try {
            return await Task.create({title, list_id: listId});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({taskId, title, isChecked}: UpdateTaskInput): Promise<Task> {
        const task: Task | null = await Task.findOne({where: {id: taskId}});

        if (!task) {
            throw new ApolloError('Такой задачи не существует', Errors.READ_ERROR);
        }

        try {
            return await task.update({title, is_checked: isChecked});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({taskId}: DeleteTaskInput): Promise<DeleteTaskResponse> {
        const task: Task | null = await Task.findOne({where: {id: taskId}});

        if (!task) {
            throw new ApolloError('Такой задачи не существует', Errors.READ_ERROR);
        }

        try {
            await task.destroy();
            return {
                message: 'Задача успешно удалена'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new TaskService();