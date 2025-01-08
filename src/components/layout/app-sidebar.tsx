'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
// import { Icons } from '../icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useGlobalContext } from '../providers/Provider';
import henceforthApi from '@/utils/henceforthApi';
import gladiatorIcon from "@/app/assets/images/hf_logo.png";
import { ArrowUpRight, Phone, PhoneCall, Scroll, Share, Share2, Shield } from 'lucide-react';
import { Icons } from '../icons';
import { Button } from '../ui/button';

export default function AppSidebar({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const { companyDetails } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActiveRoute = (itemUrl: string) => pathname === itemUrl;

  return (
    <div className="w-full overflow-hidden">
      <SidebarProvider className="relative">
        <Sidebar collapsible='icon'  className="ml-5 mt-5 mb-5 text-white rounded-xl w-[264px] overflow-hidden h-[calc(100vh-2.5rem)] ">
          <div className="flex flex-col h-full bg-inherit rounded-r-3xl">
            <SidebarHeader className="flex-none p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className='p-4 border-white border-2 rounded-full overflow-hidden bg-white/10'>

                <div className="w-[144px] h-[144px] border-white border rounded-full overflow-hidden bg-white/10">
                  <img
                    className="w-full h-full object-cover"
                    src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, gladiatorIcon?.src)}
                    alt="logo"
                    />
                </div>
                    </div>
                <div className="text-center group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
                  <h1 className="text-xl font-semibold ">
                    {companyDetails?.company_name ?? "Chat with Amy"}
                  </h1>
                  <p className="text-sm opacity-70">
                    {companyDetails?.company_description ?? "This is Amy Chatbot"}
                  </p>
                </div>
                <Link 
                  href={companyDetails?.company_url ?? "https://henceforthsolutions.com"}
                  className="px-8 w-full flex gap-[10px] fs-16 py-[8px] bg-white text-black rounded-[5px] border border-current text-sm hover:opacity-80 transition-opacity group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-2 group-has-[[data-collapsible=icon]]/sidebar-wrapper:border-transparent group-has-[[data-collapsible=icon]]/sidebar-wrapper:bg-white/10 group-has-[[data-collapsible=icon]]/sidebar-wrapper:rounded-full group-has-[[data-collapsible=icon]]/sidebar-wrapper:justify-center"
                >
                  <span className='flex w-full  items-center gap-[10px] ml-[10px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden'>
                  Visit Website <ArrowUpRight size={18}  />
                  </span>
                 

                  <ArrowUpRight size={18}  className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:block hidden" />
              
                </Link>
              </div>
            </SidebarHeader>

            {/* Empty flex-grow div to push footer to bottom */}
            <div className="flex-grow"></div>

            <SidebarFooter className="flex-none p-4 border-t border-white/10">
                <div className="space-y-2 flex items-left group-has-[[data-collapsible=icon]]/sidebar-wrapper:items-center flex-col">
                <Link href="/privacy-policy" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group" title="Privacy Policy">
                  <Shield className="w-5 h-5 opacity-70" />
                  <span className="opacity-70 group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">Privacy Policy</span>
                </Link>
                <Link href="/terms" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group" title="Terms & Conditions">
                  <Scroll className="w-5 h-5 opacity-70" />
                  <span className="opacity-70 group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">Terms & Conditions</span>
                </Link>
                </div>
            </SidebarFooter>
          </div>
        </Sidebar>

        <SidebarInset>
          <header className=" text-white bg-dynamic flex mt-5 mr-2 group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-10 rounded-xl h-16 shrink-0 items-center gap-2 ">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
            </div>
            <h1 className="fs-20 font-semibold">Hi, I’m Amy. Your AI Agent!</h1>
            <div className="px-4 flex gap-5 ml-auto">
             <Button className='flex items-center gap-2 font-normal px-4 py-2  text-black rounded-lg transition-colors duration-200'>
              <Phone size={18} />
              <span className=''>
                Call Agent
                </span>
             </Button>
             <Button className='flex items-center gap-2 font-normal px-4 py-2  text-black rounded-lg transition-colors duration-200'>
              <Share2 size={18} />
              
              </Button>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}