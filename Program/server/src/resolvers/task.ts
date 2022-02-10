// Core
import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {DesksRights, MyContext} from "../types";

// Args
import {CreateTaskInput, DeleteTaskInput, DeleteTaskResponse, UpdateTaskInput} from "../service/TaskService/args";

// Models
import {Task} from "../models/Task";

// Service
import TaskService from "../service/TaskService/TaskService";

@Resolver()
export class TaskResolver {
    @Mutation(() => Task)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_LIST]})
    async createTask(@Ctx() ctx: MyContext, @Arg('options') options: CreateTaskInput): Promise<Task> {
        return TaskService.create(options);
    }

    @Mutation(() => Task)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_LIST]})
    async updateTask(@Ctx() ctx: MyContext, @Arg('options') options: UpdateTaskInput): Promise<Task> {
        return TaskService.update(options);
    }

    @Mutation(() => DeleteTaskResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_LIST]})
    async deleteTask(@Ctx() ctx: MyContext, @Arg('options') options: DeleteTaskInput): Promise<DeleteTaskResponse> {
        return TaskService.delete(options);
    }
}