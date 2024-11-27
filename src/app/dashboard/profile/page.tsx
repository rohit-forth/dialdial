import React from 'react';
import ProfileBg from '@/app/assets/images/profilebg.png';
import ProfileImg from '@/app/assets/images/profileimg.png';
import gladiatorLogo from 'app/assets/images/gladiator.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Users, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {Icons} from "@/components/icons"

const Page = () => {
  return (
    <div className='p-10 min-h-screen bg-gray-50'>
      
      <h1 className='text-4xl font-bold mb-6 text-black'>Settings</h1>
      <div className='relative '>
        {/* Background Image */}
        <div className='w-full flex justify-center overflow-hidden'>
          <img 
            src={ProfileBg.src} 
            alt='profile-bg' 
            className=' h-[274px] rounded-xl w-[906px] object-cover'
          />
        </div>

        {/* White Card Container */}
        <Card className='max-w-4xl mx-auto -mt-28 relative z-10 w-[732px] h-[514px]'>
          <CardContent className='p-6'>
            {/* Profile Section */}
            <div className='flex flex-row-reverse justify-between items-start mb-8'>
              <div className='flex flex-col items-center w-full '>
                <Avatar className='h-[140px] w-[140px] -mt-28  border-white shadow-lg'>
                  <AvatarImage src={ProfileImg.src} alt='John Doe' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className='mt-4 w-[135px] h-[70.11px]'>
                  <h2 className='text-center text-2xl font-semibold'>John Doe</h2>
                  <p className='text-center text-gray-500'>+61 5221 5521 55</p>
                  <p className='text-center text-gray-500'>john.doe@gmail.com</p>
                </div>
              </div>
              <Button className='absolute' variant="outline" size="icon">
                <Pencil className='h-4 w-4' />
              </Button>
            </div>

            {/* Two Column Layout */}
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Left Column */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <div className='bg-gray-100 p-2 rounded'>
                    <img 
                      src={gladiatorLogo.src} 
                      alt="Gladiator Ltd." 
                      className='h-6 w-6'
                    />
                  </div>
                  <span className='font-semibold'>Gladiator Ltd.</span>
                </div>

                <Button 
                  variant="ghost" 
                  className='w-full justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Team members
                  </div>
                  <span>→</span>
                </Button>

                <Button 
                  variant="ghost" 
                  className='w-full justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <Bell className='h-4 w-4' />
                    Notification settings
                  </div>
                  <span>→</span>
                </Button>

                <Button 
                  variant="ghost" 
                  className='w-full justify-between text-red-500'
                >
                  Delete account
                </Button>
              </div>

              {/* Right Column */}
              <div className='bg-blue-50  p-6 rounded-lg'>
                <div className='mb-4 flex flex-col items-center'>
                  <h3 className='text-md  text-center font-bold text-gray-500'>Current plan:</h3>
                  <p className='text-xl text-primary font-semibold'>Basic</p>
                </div>

                <p className='text-sm text-gray-500 mb-4 text-center'>150 credits left</p>
                <Progress  value={30}  className='mb-4' />

                <Button className='w-full flex items-center gap-2'>
                  {/* <span className=''> <Icons.RocketLogo/> </span> */}
                  <span className=''>Upgrade</span>
                  
                  {/* <span className='ml-auto'>{">"}</span> */}
                </Button>

                <p className='text-center text-sm text-gray-500 mt-4'>
                  Renew on: Sep 26, 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;