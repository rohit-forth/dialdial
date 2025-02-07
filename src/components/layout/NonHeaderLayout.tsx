import AppSidebar from "@/components/layout/app-sidebar-no-inset";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: 'Next Shadcn Dashboard Starter',
//   description: 'Basic dashboard with Next.js and Shadcn'
// };

export default function NoHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
