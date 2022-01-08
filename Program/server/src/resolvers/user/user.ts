// Core
import {Args, Ctx, Query, Resolver} from "type-graphql";

// Models
import {User} from "../../models/User";
import {Label} from "../../models/Label";

// Types
import {MyContext} from "../../types";

// ArgsTypes
import {GetUserArgs, GetUserOrganizationsArgs} from './userArgs';
import {Organization} from "../../models/Ogranization";

@Resolver()
export class UserResolver {
    @Query(() => User)
    async user(@Ctx() ctx: MyContext, @Args() {id}: GetUserArgs): Promise<User | null> {
        return await User.findOne({include: [{model: Label}, {model: Organization}], where: {id}});
    }
}
