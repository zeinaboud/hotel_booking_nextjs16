import z from "zod"

export const signInSchema = z.object({
    email: z.string().email({message:"هذا الايميل غير صالح"}),
    password:z.string().min(3,{message:"يجب على الاقل ان تكون 3 احرف"}),
}
)
export type signInSchemaType = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
    email: z.string().email({message:"هذا الايميل غير صالح"}),
    password: z.string().min(3, { message: "يجب على الاقل ان تكون 3 احرف" }),
    name:z.string().min(4,{message:"the name should be 4 chars at least"}),
}
)
export type signUpSchemaType = z.infer<typeof signUpSchema>

