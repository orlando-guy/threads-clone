"use server"

import { connectToDB } from "@/lib/mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface UpdateUserParams {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

interface FetchUsersProps {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
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

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: FetchUsersProps) {
    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, "i")

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId } // $ne stands for "not equal" so <- this expression means "not equal to userId"
        }

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
        
        const totalUserCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUserCount > skipAmount + users.length

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Failed to fetch Users. ${error.message}`)
    }
}