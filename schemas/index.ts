import { UserRole } from "@prisma/client";
import * as z from "zod";


export const SettingsSchema = z.object({
    name: z.optional(z.string().min(1)),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6))
}).refine((data) => {
    if(data.password && !data.newPassword) {
        return false;
    }
    return true;
}, {
    message: "New password is required!",
    path: ["newPassword"]
})
.refine((data) => {
    if(data.newPassword && !data.password) {
        return false;
    }
    return true;
}, {
    message: "Password is required!",
    path: ["password"]
})
export const RegisterSchema = z.object({
    email: z.string().email({
        message: "invalid email! example:- tanuj@mail.com"
    }),
    password: z.string().refine((password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
        return passwordRegex.test(password);
    }, {
        message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 symbol."
    }),
    name: z.string().min(1, {
        message: "Name is required"
    })
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "invalid email!"
    }),
    password: z.string().min(1, {
        message: "Invalid password!"
    }),
    code: z.optional(z.string()),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "invalid email!"
    })
});


export const newPasswordSchema = z.object({
    password: z.string().refine((password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
        return passwordRegex.test(password);
    }, {
        message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 symbol."
    })
});
