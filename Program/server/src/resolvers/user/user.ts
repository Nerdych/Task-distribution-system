// Core
import {Args, Ctx, Query, Resolver} from "type-graphql";

// Models
import {User} from "../../models/User";
import {Label} from "../../models/Label";
import {Organization} from "../../models/Ogranization";
import {Role} from "../../models/Role";
import {Message} from "../../models/Message";

// Types
import {MyContext} from "../../types";

// ArgsTypes
import {GetUserArgs} from './userArgs';

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async user(@Ctx() ctx: MyContext, @Args() {id}: GetUserArgs): Promise<User | null> {
        return await User.findOne({
            include: [{model: Label}, {model: Organization}, {model: Message}, {model: Role}],
            where: {id}
        });
    }
}
