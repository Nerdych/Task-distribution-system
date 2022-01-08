// Core
import {Ctx, Query, Resolver} from "type-graphql";

// Models
import {Label} from "../models/Label";

// Types
import {MyContext} from "../types";

@Resolver()
class LabelResolver {
    @Query(() => [Label])
    async labels(@Ctx() ctx: MyContext) {
        return await Label.findAll();
    }
}
