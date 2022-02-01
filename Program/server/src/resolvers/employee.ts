// Core
import {Arg, Ctx, Query, Resolver, UseMiddleware} from "type-graphql";

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
import {GetAllEmployeesInput} from "../service/EmployeeService/args";

@Resolver()
export class EmployeeResolver {
    @Query(() => [UserOrganization])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_EMPLOYEES]})
    async employees(@Ctx() ctx: MyContext, @Arg('options') options: GetAllEmployeesInput): Promise<UserOrganization[]> {
        const result = await EmployeeService.getAll(ctx, options);
        return result;
    }
}
