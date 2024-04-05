"use server"

import Thread from "@/lib/models/thread.model";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";

interface ThreadParams {
    text: string,
    author: string,
    communityID: string | null;
    path: string;
}

export async function createThread({ text, author, communityID, path }: ThreadParams) {
    try {
        connectToDB()

        const createdThread = await Thread.create({
            text,
            author,
            path,
            community: null
        })

        // Update the user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Failed to create thread ${error.message}`)
    }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    connectToDB()

    // Calculate the number of threads to skip
    const skipAmount = (pageNumber - 1) * pageSize

    // fetch threads that have no parent (top-level threads)
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })

    // only count the top-level threads not the childrens
    const totalThreadCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] }
    })

    const threads = await threadsQuery.exec()

    const isNext = totalThreadCount > skipAmount + threads.length

    return { threads, isNext }
}