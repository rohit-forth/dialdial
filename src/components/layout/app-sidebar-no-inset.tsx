"use client";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";

import * as React from "react";
import { useGlobalContext } from "../providers/Provider";
import henceforthApi from "@/utils/henceforthApi";
import gladiatorIcon from "@/app/assets/images/hf_logo.png";
import { ArrowUpRight, Scroll, Shield } from "lucide-react";

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const { agentDetails } = useGlobalContext();
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full overflow-hidden">
      <SidebarProvider className="relative">
        <Sidebar
          collapsible="icon"
          className="ml-5 mt-5 mb-5 text-fontDynamic rounded-xl w-[264px] overflow-hidden h-[calc(100vh-2.5rem)] "
        >
          <div className="flex flex-col h-full  rounded-r-3xl">
            <SidebarHeader className="flex-none p-6 group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 border-mediumFontDynamic border-2 rounded-full overflow-hidden bg-white/10">
                  <div className="w-[144px] h-[144px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[50px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[50px] border-lightFontDynamic border rounded-full overflow-hidden bg-white/10">
                    <img
                      className="w-full h-full object-cover"
                      src={henceforthApi?.FILES?.imageOriginal(
                        agentDetails?.agent_image,
                        gladiatorIcon?.src
                      )}
                      alt="logo"
                    />
                  </div>
                </div>
                <div className="text-center group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                  <h1 className="text-xl font-semibold ">
                    {agentDetails?.page_title ?? "Chat with Amy"}
                  </h1>
                  <p className="text-sm opacity-70">
                    {agentDetails?.page_description ?? "This is Amy Chatbot"}
                  </p>
                </div>
                <Link
                  target="_blank"
                  href={
                    agentDetails?.page_url ?? "https://henceforthsolutions.com"
                  }
                  className="px-8 w-full flex gap-[10px] fs-16 py-[8px] bg-transparent  rounded-[5px] border border-fontDynamic  text-sm hover:opacity-80 transition-opacity group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-2 group-has-[[data-collapsible=icon]]/sidebar-wrapper:border-transparent group-has-[[data-collapsible=icon]]/sidebar-wrapper:bg-white/10 group-has-[[data-collapsible=icon]]/sidebar-wrapper:rounded-full group-has-[[data-collapsible=icon]]/sidebar-wrapper:justify-center"
                >
                  <span className="flex  w-full  items-center gap-[10px] ml-[10px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                    Visit Website <ArrowUpRight size={18} />
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:block hidden"
                  />
                </Link>
              </div>
            </SidebarHeader>

            {/* Empty flex-grow div to push footer to bottom */}
            <div className="flex-grow"></div>

            <SidebarFooter className="flex-none p-4 ">
              <div className="space-y-2 flex items-left group-has-[[data-collapsible=icon]]/sidebar-wrapper:items-center flex-col">
                <Link
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                  title="Privacy Policy"
                >
                  <Shield className="w-5 h-5 opacity-70" />
                  <span className="opacity-70 group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                    Privacy Policy
                  </span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                  title="Terms & Conditions"
                >
                  <Scroll className="w-5 h-5 opacity-70" />
                  <span className="opacity-70 group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                    Terms & Conditions
                  </span>
                </Link>
              </div>
            </SidebarFooter>
          </div>
        </Sidebar>
        {children}
      </SidebarProvider>
    </div>
  );
}
