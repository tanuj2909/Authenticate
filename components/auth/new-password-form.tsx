"use client";

import { CardWrapper } from "@/components/auth/card-wrapper"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage, 
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { newPasswordSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {

    const param = useSearchParams();
    const token = param.get('token');

    

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return <CardWrapper 
        headerLabel="Enter your new password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to Login"
    >
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" type="password" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormSuccess message={success} />
                    <Button 
                        type="submit"
                        className="w-full"
                    >
                        Reset password
                    </Button>
                </div>
            </form>
        </Form>
    </CardWrapper>
}