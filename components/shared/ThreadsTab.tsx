import fetchUserThreads from "@/lib/actions/user.action"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"

interface ThreadsTabProps {
    currentUserId: string,
    accountId: string,
    accountType: string,
}

const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType,
}: Readonly<ThreadsTabProps>) => {

    let result = await fetchUserThreads(accountId)

    if (!result) redirect('/')

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={accountType === "User" ?
                        {name: result.name, image: result.image, id: result.id} :
                        {name: thread.author.name, image: thread.author.image, id: thread.author.id}
                    }
                    community={thread.community} // TODO: update this params to indicate if we're the owner of this community 
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab