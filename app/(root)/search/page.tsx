import UserCard from "@/components/cards/UserCard"
import { fetchUsers, fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
// import Image from "next/image"
import { redirect } from "next/navigation"

export default async function SearchPage() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarderd) redirect('/onboarding')
 
    const result = await fetchUsers({
        userId: user.id,
        searchString: " ",
        pageNumber: 1,
        pageSize: 25,
    })

    return (
        <section>
            <h1 className="head-text">Search</h1>
            {/* TODO: Here's where I took a break, a 04:30:41 */}
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    <>
                        {result.users.map(person => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType="User"
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}