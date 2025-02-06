// app/layout.tsx
// import { auth } from '@/auth';
//import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { GlobalProvider } from "@/components/providers/Provider";
import henceforthApi from "@/utils/henceforthApi";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "QIXS",
  description: "Basic dashboard with Next.js and Shadcn",
};

const rubik = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("COOKIES_ADMIN_ACCESS_TOKEN")?.value;

  let userInfo = null;
  if (accessToken) {
    try {
      henceforthApi.setToken(accessToken);
      const apiRes = await henceforthApi.SuperAdmin.profile();
      userInfo = { ...apiRes.data, access_token: accessToken };
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Consider redirecting to login or handling the error appropriately
    }
  }

  // const session = await auth();

  return (
    <html lang="en" className={rubik.className} suppressHydrationWarning>
      <body className="overflow-hidden">
        <NextTopLoader color="#000" showSpinner={false} />
        <GlobalProvider userInfo={userInfo}>{children}</GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}
