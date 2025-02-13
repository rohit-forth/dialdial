import AppSidebar from "@/components/layout/app-sidebar-no-inset";
import type { Metadata } from "next";
import Meteors from "../common/Meteors";

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
      <div className="bg-gradient-to-br  from-mediumDynamic via-lightDynamic  to-lightFontDynamic h-screen flex">
        <Meteors number={20} />
        <AppSidebar>{children}</AppSidebar>
      </div>
    </>
  );
}
