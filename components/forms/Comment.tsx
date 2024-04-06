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
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { commentValidation } from '@/lib/validations/thread';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.action';

interface CommentProps {
    threadId: string,
    currentUserImg: string,
    currentUserId: string
}

const Comment = ({
    threadId,
    currentUserImg,
    currentUserId,
}: Readonly<CommentProps>) => {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            thread: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof commentValidation>) => {
        await addCommentToThread(JSON.parse(threadId), values.thread, JSON.parse(currentUserId), pathname)

        form.reset()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex items-center w-full gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='current user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='no-focus border-none border-transparent text-light-1'>
                                <Input
                                    type='text'
                                    placeholder='Comment...'
                                    className='account-form_input no-focus text-light-1 outline-none'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500 comment-form_btn'>Reply</Button>
            </form>
        </Form>
    )
}

export default Comment