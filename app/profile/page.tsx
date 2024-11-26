"use client"
import React, { useState } from 'react';
import Profile_image from '@images/profileimg.png';
import Profile_Banner from '@images/profile_banner.png';
import gladiatorLogo from '@images/gladiator.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Icons } from "@/components/icons"
import DashboardLayout from '../dashboard/layout';
import { Separator } from '@/components/ui/separator';
import { useGlobalContext } from '@/components/providers/Provider';
import AccountModal from '@/components/modal/account-and-password';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Bell, Delete, EarthIcon, HelpCircle, Lock, Shield, Trash } from 'lucide-react';
import Page from '../(auth)/(signin)/page';
import PageContainer from '@/components/layout/page-container';
import PasswordChangeDialog from '@/components/modal/passwordmodal';
import henceforthApi from '@/utils/henceforthApi';
import toast from 'react-hot-toast';

const ProfileView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { userInfo,getProfile,Toast } = useGlobalContext();
  console.log(userInfo);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = async (data: any) => {
    console.log('Saving profile:', data);
    const payload = {
      email:data?.email,
      name:data?.name,
    }
    try {
     const apiRes=await henceforthApi.SuperAdmin.updateProfile(data);
     toast.success("Profile Updated Successfully",{
      style:{fontSize:'14px', background:"#BBBBBB"}
     });
     getProfile()
    } catch (error) {
      
    }finally{

      handleCloseModal();
    }
  };

  const handlePasswordChange = async (data: any) => {
    console.log('Changing password:', data);
    handleCloseModal();
  };

  return (
    <PageContainer scrollable>
    <div className='p-4 sm:p-7 min-h-screen bg-gray-50'>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Profile</h2>
      <div className='relative'>
        {/* Background Image */}
        <div className='w-full flex justify-center overflow-hidden h-[200px] sm:h-[250px] lg:h-[300px]'>
          <img
            src={Profile_Banner.src}
            alt='profile-bg'
            className='h-full rounded-xl w-full object-cover'
          />
        </div>

        {/* White Card Container */}
        <Card className='max-w-4xl mx-auto rounded-2xl -mt-24 sm:-mt-32 lg:-mt-48 relative z-10 w-full'>
          <CardContent className='p-4 sm:p-6'>
            {/* Profile Section */}
            <div className='flex flex-col items-center pb-8 relative'>
              <Button 
                onClick={handleOpenModal} 
                className='absolute right-0 top-0 rounded-lg' 
                variant="outline" 
                size="icon"
              >
                <Icons.Pencil />
              </Button>
              
              <Avatar className='h-[100px] w-[100px] sm:h-[140px] sm:w-[140px] -mt-16 sm:-mt-28  border-white'>
                <AvatarImage src={Profile_image.src} className='w-full h-full' alt='John Doe' />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              
              <div className='mt-4 text-center'>
                <h2 className='text-xl sm:text-2xl font-semibold'>{userInfo?.name}</h2>
                {/* <p className='text-gray-500'>+61 5221 5521 55</p> */}
                <p className='text-gray-500'>{userInfo?.email}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Settings Section */}
            <div className='space-y-6'>
              {/* <div className='flex items-center gap-2 px-2'>
                <div className='bg-gray-100 p-2 rounded'>
                  <img src={gladiatorLogo.src} alt="Gladiator Ltd." className='h-6 w-6' />
                </div>
                <span className='font-medium text-lg sm:text-xl'>Gladiator Ltd.</span>
              </div> */}

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Left Column */}
                <div className='space-y-2'>
                  <h3 className='font-medium text-lg px-3'>Account Settings</h3>
                  <ul className='flex gap-2 flex-col p-3 bg-gray-50 rounded-lg'>
                    <li className='flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                      <span className='flex items-center gap-2'>
                        <Bell />Notification settings
                      </span>
                      <Icons.RightArrow />
                    </li>
                    <li className='flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                      <span className='flex items-center gap-2'>
                        <Lock />Privacy settings
                      </span>
                      <Icons.RightArrow />
                    </li>
                    <li className='flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                      <span className='flex items-center gap-2'>
                        <Shield />Security settings
                      </span>
                      <Icons.RightArrow />
                    </li>
                  </ul>
                </div>

                {/* Right Column */}
                <div className='space-y-2'>
                  <h3 className='font-medium text-lg px-3'>Additional Settings</h3>
                  <ul className='flex gap-2 flex-col p-3 bg-gray-50 rounded-lg'>
                  
                    <li className='flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                      <span className='flex items-center gap-2'>
                        <HelpCircle />Help & Support
                      </span>
                      <Icons.RightArrow />
                    </li>
                    <PasswordChangeDialog />
                 
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <AccountModal
         
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onSave={handleSaveProfile}
     
        />
      )}
    </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ProfileView />
    </DashboardLayout>
  );
}