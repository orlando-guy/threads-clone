"use client"

import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { threadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.action';

/* import { updateUser } from '@/lib/actions/user.action'; */

interface AccountProfileProps {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    },
    btnTitle: string;
}

const PostThread = ({ userId }: Readonly<{ userId: string }>) => {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof threadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityID: null,
            path: pathname
        })

        router.push('/')
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10 mt-10"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea
                                    rows={15}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500'>Post thread</Button>
            </form>
        </Form>
    )
}

export default PostThread