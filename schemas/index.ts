import * as z from "zod";

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
    })
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
