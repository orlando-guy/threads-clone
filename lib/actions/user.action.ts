"use server"

import { connectToDB } from "@/lib/mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";

interface UpdateUserParams {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

export async function updateUser({
    bio,
    image,
    name,
    path,
    userId,
    username,
}: UpdateUserParams): Promise<void> {
    connectToDB()

    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarderd: true
            },
            { upsert: true }
        )

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB()

        return await User.findOne({ id: userId })
            /* .populate({
                path: 'communities',
                model: 'Community'
            }) */
    } catch (error: any) {
        throw new Error(`Failed to fecth user ${error.message}`)
    }
}

export default async function fetchUserThreads(userId: string) {
     try {
        connectToDB()

        // TODO: Populate community
        const threads = User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })

            return threads
     } catch (error: any) {
        throw new Error(`Failed to fetch user's threads. ${error.message}`)
     }
} 