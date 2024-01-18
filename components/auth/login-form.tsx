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
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") ==="OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";

    const [ showTwoFactor, setShowTwoFactor ] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        }
    })

    const onSubmit = ( values: z.infer<typeof LoginSchema> ) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values).then((data) => {
                if(data?.error) {
                    form.reset();
                    setError(data.error);
                }
                if(data?.success) {
                    form.reset();
                    setError(data.success);
                }
                if(data?.twoFactor) {
                    setShowTwoFactor(true);
                }
            }).catch(() => {
                setError("Something went wrong!")
            })
        })
        
    }

    return <CardWrapper 
        headerLabel="Welcome back"
        backButtonHref="/auth/register"
        backButtonLabel="Don't have an account?"
        showSocial
    >
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    {!showTwoFactor && (
                    <>
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password" {...field} disabled={isPending} />
                                    </FormControl>
                                    <Button
                                        size={'sm'}
                                        variant={'link'}
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href={'/auth/reset'}>
                                            Forgot password?
                                        </Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>)}
                    {showTwoFactor && (
                        <FormField 
                            control={form.control}
                            name="code"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success} />
                    <Button 
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </div>
            </form>
        </Form>
    </CardWrapper>
}