"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async( values: z.infer<typeof ResetSchema> ) => {
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email } = validatedFields.data;
    
    const user = await getUserByEmail(email);

    if(!user) {
        return { error: "Invalid Email" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: "Reset email sent!"};
}