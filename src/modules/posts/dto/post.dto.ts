import { IsNotEmpty, MinLength } from "class-validator"
export class PostDto{
    @IsNotEmpty()
    @MinLength(4)
   readonly titles: string

   @IsNotEmpty()
    readonly body: string
}