import {ArgsType, Field, ID} from "type-graphql";

@ArgsType()
export class GetUserArgs {
    @Field(() => ID)
    id!: number;
}

@ArgsType()
export class GetUserOrganizationsArgs {
    @Field(() => ID)
    id!: number;
}