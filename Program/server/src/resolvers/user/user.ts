// Core
import {Args, Ctx, Query, Resolver} from "type-graphql";

// Models
import {User} from "../../models/User";
import {Label} from "../../models/Label";
import {Desk} from "../../models/Desk";
import {ColumnTable} from "../../models/Column";

// Types
import {MyContext} from "../../types";

// ArgsTypes
import {GetUserArgs, GetUserOrganizationsArgs} from './userArgs';
import {Organization} from "../../models/Ogranization";

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async user(@Ctx() ctx: MyContext, @Args() {id}: GetUserArgs): Promise<User | null> {
        return await User.findOne({include: [{model: Label}, {model: Organization}], where: {id}});
    }

    @Query(() => Desk, {nullable: true})
    async hello(@Ctx() ctx: MyContext, @Args() {id}: GetUserOrganizationsArgs): Promise<Desk | null> {
        const res = await Desk.findOne({include: [{model: ColumnTable}], where: {id}});
        return res;
    }
}
