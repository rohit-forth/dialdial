'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  MessagesSquare,
  GalleryVerticalEnd,
  LogOut
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import ProfileImg from '@images/profileimg.png'
import { Icons } from '../icons';
import ProjectIcon from "@icons/projecticon.svg"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import DialogContentCommon from '../modal/DialogueContentCommon';
import { useGlobalContext } from '../providers/Provider';

export const company = {
  name: 'Acme Inc',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise'
};

export default function AppSidebar({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
 
  const router = useRouter()
  const {userInfo}=useGlobalContext()
  const pathname = usePathname();
  console.log("pathname",pathname)
  const [logoutBtn, setLogoutBtn] = React.useState(false);
  // Only render after first client-side mount
  React.useEffect(() => {
    setMounted(true);
  }, []);
  


  const signOut = () => {

    router.replace("/")
  }
  if (!mounted) {
    return null; // or a loading skeleton
  }

   
  const isActiveRoute = (itemUrl: string) => {
    // Handle each route type explicitly
    switch (itemUrl) {
      case '/dashboard':
        return pathname === '/dashboard';
        
      case '/chat/page/1':
        return pathname === '/chat/page/1' || 
               pathname.match(/^\/chat\/\d+\/view/);
        
      case '/call-management/page/1':
        return pathname === '/call-management/page/1' || 
               pathname.match(/^\/call-management\/\d+\/view/);
               
      case '#': // Logout
        return false;
        
      default:
        return pathname === itemUrl;
    }
  };

  return (
    <SidebarProvider className='sidebar-layout'>
      {/* ..........sidebar......... */}
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className=" border-b-2 pb-6 border-common flex justify-center text-sidebar-primary-foreground">
            {/* <h1 className='text-4xl text-primary text-center'>DAIL AI</h1> */}
            {/* <Badge className=' h-[40px] common-bg hover:' variant="default"><Icons.BellIcon /></Badge> */}
            <img src={ProjectIcon.src} alt="logo"  />
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden ">
          <SidebarGroup>
            <SidebarGroupLabel className='-mt-[35px]'>MAIN MENU</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon ? Icons[item?.icon] : Icons.logo;
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                asChild
                                isActive={pathname?.includes(subItem.url)}
                                >
                                <Link href={item.title!=="Logout"?item.url:"#"}>
                            <Icon />
                            <span onClick={()=>item.title==="Logout"?setLogoutBtn(true):""} >{item.title}</span>
                            </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={!!isActiveRoute(item.url)}
                  >
                    {/* {item.title === "Logout" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Link href="#" className="flex items-center gap-2 text-sm ms-[9px]">
                            <Icon />
                            { <span>{item.title}</span>}
                          </Link>
                        </AlertDialogTrigger>
                        <DialogContentCommon 
                          className="bg-danger text-white" 
                          submitText="Yes, logout" 
                          title="Confirm Logout" 
                          des="Are you sure you want to logout from your account?" 
                          onConfirm={() => signOut()}
                        />
                      </AlertDialog>
                    ) : ( */}
                      <Link onClick={()=>( item.title==="Logout" && setLogoutBtn(true))} href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    {/* )} */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                );
              })}
                {<AlertDialog open={logoutBtn} onOpenChange={setLogoutBtn}><DialogContentCommon 
                          className="bg-danger text-white" 
                          submitText="Yes, logout" 
                          title="Confirm Logout" 
                          des="Are you sure you want to logout from your account?" 
                       
                        />
                        </AlertDialog>}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* ......header...... */}
      <SidebarInset>
        <header className="header flex mt-2 mr-2 ml-2 rounded-xl h-16 shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
         <Link href={"/profile"} className='no-underline'><div className='flex gap-2 px-4 cursor-pointer'>
         
            {/* </div> */}
            {/* card 2 */}
            <div className='profile-card items-center  flex flex-row gap-2'>
              <div className='items-center flex flex-row gap-1' >
                <Avatar>
                  <AvatarImage src={ProfileImg.src} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className='text-md'>{userInfo?.name}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span><Icons.DownCircleArrow /></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='relative right-6 p-2 font-semibold bg-white'>
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><Icons.Profile /><span className='ml-2'>My Profile</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings"><Icons.settings /><span className='ml-2'>Settings</span></Link>
                  </DropdownMenuItem>
                
                  <DropdownMenuItem onSelect={(e) => {
                    // Prevent the dropdown from closing when clicking the alert trigger
                    e.preventDefault()
                  }}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className='flex items-center justify-between w-full text-danger cursor-pointer'>
                          <span className='flex items-center gap-2'>
                            <Icons.LogoutRed />
                            Logout
                          </span>

                        </div>
                      </AlertDialogTrigger>
                      <DialogContentCommon
                        className="bg-danger text-white"
                        submitText="Yes, log me out"
                        title="Confirm Logout"
                        des="Are you sure you want to logout?"
                      
                      />
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <div className="flex items-center gap-2 px-4">
                <ThemeToggle />
              </div> */}
            </div>
          </div>
          </Link> 

          {/* <div className=" hidden w-1/3 items-center gap-2 px-4 md:flex ">
            <SearchInput />
          </div> */}
        </header>
        {/* page main content */}
        {children}
      </SidebarInset>
      {/* <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle >{"Confirm Logout"}</AlertDialogTitle>
                <AlertDialogDescription>
                    {props?.des}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className={"bg-red-400 text-white"}>Yes, log me out</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent> */}
    </SidebarProvider>
  );
}
