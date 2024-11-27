"use client"
import DashboardLayout from '@/app/dashboard/layout';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heading } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
// import card_background_image from '../../../public/images/background.png'



const JobCreate = () => {
  const router=useRouter();
  return (
    <PageContainer>
      <div className='w-full flex items-center'>
        <div>
          <p className="text-2xl font-semibold mt-7 mb-2">Find the perfect plan to boost your productivity</p>
          <p className="text-muted-foreground text-base font-normal text-slate-500 ">
            Compare our tailored subscription plans and choose the one that fits your needs.
          </p>
          <p className="text-muted-foreground text-base font-normal text-slate-500 mb-8">
            Unlock advanced tools and take control of your workflow today!
          </p>
        </div>


        <div className='ms-auto'>
          <Button
            type="submit"
            className="text-primary flex justify-center"
            variant="default"
            onClick={()=>router.replace('/profile/subscription/billinghistory/page/1')}
          >
            <Icons.HistoryIcon /> <span className='ms-1'>Billing history</span>
          </Button>
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* card 1  */}
        <div className="  border p-4 rounded-lg bg-white">

          <Card className=" bg-[#F1F6FF]">
            <CardHeader>
              <CardTitle className=" text-2xl italic font-light  ">Free Plan</CardTitle>
              {/* <CardDescription>Boost your productivity for $0</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="text-lg  mb-4"><span className='text-4xl font-semibold	text-blue-600'>$0</span> / month / user</div>
              <div className="text-sm  mb-2">Credits/month:</div>
              <Select>
                <SelectTrigger id="duration" className='bg-white h-12'>
                  <SelectValue placeholder="100 Credits" />
                </SelectTrigger>
                <SelectContent position="popper">

                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="default" className='bg-[#323452] text-white h-10	'>Get started Now<span><Icons.windowicon /></span></Button>
            </CardFooter>
          </Card>
          <ul className="text-sm text-gray-600 mt-4 space-y-2 flex flex-col gap-1">
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
          </ul>

        </div>
        {/* card 2 */}
        <div className="  border p-4 rounded-lg bg-white">

          <Card className=" bg-[#323452]">
            <CardHeader>
              <CardTitle className=" text-2xl italic font-light text-white ">Basic</CardTitle>
              {/* <CardDescription>Unlock more features for $15</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="text-lg  mb-4 text-white"><span className='text-4xl font-semibold	text-white'>$100</span> / month / user</div>
              <div className="text-sm mb-2 text-white">Credits/month:</div>
              <Select >
                <SelectTrigger id="duration" className='bg-white h-12'>
                  <SelectValue placeholder="100 Credits" />
                </SelectTrigger>
                <SelectContent position="popper">

                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-between text-white">
              <Button variant="default" className='bg-[#2878F7] text-white h-10 border-none	'>Get started Now<span><Icons.windowicon /></span></Button>
            </CardFooter>

          </Card>
          <ul className="text-sm text-gray-600 mt-4 space-y-2 flex flex-col gap-1">
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
          </ul>
        </div>
        {/* card 3  */}
        {/* w-[292px] h-[628px] */}
        <div className="  border p-4 rounded-lg bg-white">
          {/* w-[260px] h-[315px]  */}
          <Card className=" bg-[#F1F6FF]">
            <CardHeader>
              <CardTitle className=" text-2xl italic font-light  ">
                Pro
              </CardTitle>
              {/* <CardDescription>For large teams, starting at $30</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="text-lg  mb-4"><span className='text-4xl font-semibold	text-blue-600'>$35</span>/ month / user</div>
              <div className="text-sm  mb-2">Credits/month:</div>
              <Select>
                <SelectTrigger id="duration" className='bg-white h-12'>
                  <SelectValue placeholder="100 Credits" />
                </SelectTrigger>
                <SelectContent position="popper">

                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="default" className='bg-[#323452] text-white h-10	'>Get started Now <span><Icons.windowicon /></span></Button>
            </CardFooter>
          </Card>
          <ul className="text-sm text-gray-600 mt-4 space-y-2 flex flex-col gap-1">
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icons.Checkicon />
              <span>Lorem Ipsum is simply dummy text</span>
            </li>

          </ul>
        </div>
      </div>
    </PageContainer>
  )
}





export default function DashboardPage() {
  return (
    <DashboardLayout>
      <JobCreate />
    </DashboardLayout>
  );
}