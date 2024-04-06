import { fetchUser, getActivity } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ActivityPage() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarderd) redirect('/onboarding')

    // TODO: get notification
    const activity = await getActivity(userInfo._id)
    
    return (
        <section className="mt-10 flex flex-col gap-5">
            {activity.length > 0 ? (
                <>
                    {activity.map(activity => (
                        <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                            <article className="activity-card">
                                <Image
                                    src={activity.author.image}
                                    alt={`${activity.author.name} profile picture`}
                                    width={20}
                                    height={20}
                                    className="rounded-full object-cover"
                                />
                                <p className="!text-small-regular text-light-1">
                                    <span className="mr-1 text-primary-500">{activity.author.name}</span> {" "}
                                    Replied to your thread
                                </p>
                            </article>
                        </Link>
                    ))}
                </>
            ) : (
                <p className="!text-base-regular text-light-3">No activity</p>
            )}
        </section>
    )
}