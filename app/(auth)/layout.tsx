import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import "@/app/globals.css"

export const metadata = {
    title: "Threads",
    description: "A Meta threads application"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex items-center justify-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}