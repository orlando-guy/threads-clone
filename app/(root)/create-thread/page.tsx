import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

async function CreateThreadPage () {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarderd) redirect('/onboarding')

    return (
        <>
            <h1 className="head-text">Create thread</h1>

            <PostThread userId={userInfo._id} />
        </>
    )
}

export default CreateThreadPage