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

export async function fetchThreadById(threadId: string) {
    try {
        connectToDB()

        // TODO: Populate community
        const thread = Thread.findById(threadId)
            .populate({ path: "author", model: User, select: "_id id name image" })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name image"
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

            return thread
    } catch (error: any) {
        throw new Error(`Failed to fetch thread ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    // TODO: put the bellow "connectToDB()" into the trycatch block
    connectToDB()

    try {
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId)

        if (!originalThread) {
            throw new Error('Thread not found')
        }

        // create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        // save the new thread
        const savedCommentThread = await commentThread.save()

        // update the original thread to include the new comment
        originalThread.children.push(savedCommentThread)

        // Save the original thread
        await originalThread.save()

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error adding comment to thread ${error.message}`)
    }
}