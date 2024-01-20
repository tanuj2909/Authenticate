"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import  { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import identityServer4 from "next-auth/providers/identity-server4";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async(values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;
    
    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.password || !existingUser.email)  {
        return { error: "Email does not exist!"};
    }

    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Conformation email sent!" };
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email) {
        if(code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken || twoFactorToken.token !== code) {
                return { error: "Invalid code!"};
                
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired) {
                return { error: "Verification code expired!"};
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id,
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
            
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

        return { twoFactor: true };
        }
        
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Somthing went wrong!" }
            }
        }
        
        throw error;
    }
    
}