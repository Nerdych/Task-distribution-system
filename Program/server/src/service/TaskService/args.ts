// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";
import {ListFound} from "../../validators/listFound";
import {TaskFound} from "../../validators/taskFound";

@InterfaceType()
class TaskResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [TaskResponse]})
export class DeleteTaskResponse extends TaskResponse {
};

@InputType({description: 'Create task data'})
export class CreateTaskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ListFound({
        message: 'Чек-лист с таким индентификатором не найден'
    })
    listId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название задачи должно иметь минимум один знак и максимум 255 символов'
    })
    title!: string;
};

@InputType({description: 'Update task data'})
export class UpdateTaskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @TaskFound({
        message: 'Задача с таким индентификатором не найдена'
    })
    taskId!: number;

    @Field(() => String, {nullable: true})
    @Length(1, 255, {
        message: 'Название задачи должно иметь минимум один знак и максимум 255 символов'
    })
    title?: string;

    @Field(() => Boolean, {nullable: true})
    isChecked?: boolean;
};

@InputType({description: 'Delete task data'})
export class DeleteTaskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @TaskFound({
        message: 'Задача с таким индентификатором не найдена'
    })
    taskId!: number;
};