"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdSettings } from "react-icons/io"
import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useState, useTransition } from "react";
import { SettingsSchema } from "@/schemas";
import { FormError } from "@/components/form-error";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { 
    Select, 
    SelectTrigger ,
    SelectContent, 
    SelectItem, 
    SelectValue
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
    
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values).then((data) => {
                if(data.success) {
                    setSuccess(data.success);
                }
                if(data.error) {
                    setError(data.error);
                }
            }).catch(() => {
                setError("Somthing went wrong");
            })
        })
        
    }

    return <Card className="w-[600px]">
        <CardHeader>
            <p className="text-2xl font-semibold flex justify-center">
               <IoMdSettings className="w-8 h-8 text-slate-800 mr-2"/> 
               Settings
            </p>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="name"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {!user?.isOAuth && (
                            <>
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type="email"
                                                    placeholder="email"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
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
                                                <Input 
                                                    {...field}
                                                    type="password"
                                                    placeholder="password"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name="newPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type="password"
                                                    placeholder="new password"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        
                        
                        
                        <FormField 
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select 
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={UserRole.ADMIN}>
                                                Admin
                                            </SelectItem>
                                            <SelectItem value={UserRole.USER}>
                                                User
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {!user?.isOAuth && (
                            <FormField 
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({field}) => (
                                    <FormItem className="flex fle-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Two Factor Authentication</FormLabel>
                                            <FormDescription>
                                                Enable two factor authentication for your account.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                            )}
                        />
                        )}
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
}
 
export default SettingsPage;