// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {UserOrganization} from "../models/UserOrganization";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Types
import {MyContext, OrganizationRights} from "../types";

// Service
import EmployeeService from "../service/EmployeeService/EmployeeService";

// Args
import {
    AddEmployeeInput,
    AddEmployeeResponse, DeleteEmployeeInput, DeleteEmployeeResponse,
    GetAllEmployeesInput,
    GetOneEmployeeInput, InviteUserOrganizationInput, InviteUserOrganizationResponse,
    UpdateEmployeeInput,
    UpdateEmployeeResponse
} from "../service/EmployeeService/args";

@Resolver()
export class EmployeeResolver {
    @Query(() => [UserOrganization])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_EMPLOYEES]})
    async employees(@Ctx() ctx: MyContext, @Arg('options') options: GetAllEmployeesInput): Promise<UserOrganization[]> {
        const result = await EmployeeService.getAll(ctx, options);
        return result;
    }

    @Query(() => UserOrganization)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_EMPLOYEES]})
    async employee(@Arg('options') options: GetOneEmployeeInput): Promise<UserOrganization> {
        const result = await EmployeeService.getOne(options);
        return result;
    }

    @Mutation(() => UpdateEmployeeResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_EMPLOYEE]})
    async updateEmployee(@Arg('options') options: UpdateEmployeeInput): Promise<UpdateEmployeeResponse> {
        const result = await EmployeeService.update(options);
        return result;
    }

    @Mutation(() => InviteUserOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.INVITE_USER_ON_ORGANIZATION]})
    async inviteUserOrganization(@Ctx() ctx: MyContext, @Arg('options') options: InviteUserOrganizationInput): Promise<InviteUserOrganizationResponse> {
        const result = await EmployeeService.inviteUser(ctx, options);
        return result;
    }

    @Mutation(() => AddEmployeeResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.INVITE_USER_ON_ORGANIZATION]})
    async addEmployee(@Ctx() ctx: MyContext, @Arg('options') options: AddEmployeeInput): Promise<AddEmployeeResponse> {
        const result = await EmployeeService.add(ctx, options);
        return result;
    }

    @Mutation(() => DeleteEmployeeResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_EMPLOYEE]})
    async deleteEmployee(@Arg('options') options: DeleteEmployeeInput): Promise<DeleteEmployeeResponse> {
        const result = await EmployeeService.delete(options);
        return result;
    }
}
