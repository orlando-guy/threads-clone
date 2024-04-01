import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider} from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A clone of @threads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en ">
        <body className={inter.className}>
          {/* 
            <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
              <h1>My App</h1>
              <SignedIn>
                Mount the UserButton component 
                <UserButton />
              </SignedIn>
              <SignedOut>
                Signed out users get sign in button
                <SignInButton />
              </SignedOut>
            </header> 
          */}

          <Topbar />
          <main>
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
