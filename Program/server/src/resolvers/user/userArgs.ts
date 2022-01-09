import {ArgsType, Field, ID} from "type-graphql";

@ArgsType()
export class GetUserArgs {
    @Field(() => ID)
    id!: number;
}