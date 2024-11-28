'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useGlobalContext } from '../providers/Provider';
import Profile_image from '@/app/assets/images/profileimg.png';
// import { Upload } from "@/components/ui/upload";
interface UserProfile {
 name:string,
  
  email: string;
  
}

interface AccountModalProps {
  initialData?: UserProfile;
  onSave?: (data: UserProfile) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  
  isOpen,
  setIsOpen,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {userInfo} = useGlobalContext();
  const displayName=userInfo?.name;
  const [profileData, setProfileData] = useState<any>(userInfo);
  const isInitializedRef = useRef(false);

  // Initialize form data only once when modal is first opened

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      setIsLoading(true);
      try {
        await onSave(profileData);
        setIsOpen(false);
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof UserProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData((prev:any) => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const handleFileUpload = (file: File) => {
    // Handle file upload logic here
    console.log('Uploaded file:', file);
  };

  return (
    <div className="relative flex justify-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md p-6">
              <p className="text-lg font-semibold">Profile Settings</p>
              
              <form onSubmit={handleProfileSubmit} className="mt-2 space-y-4">
                <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
          <AvatarImage src={Profile_image.src} />
          <AvatarFallback>{"SA"}</AvatarFallback>
        </Avatar>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-sm font-medium">{`${displayName}`}</p>
                    {/* <Button type="button" variant="outline" size="sm" className="mt-1">
                      Change
                    </Button>
                 */}

                  

              <Input type="file" className='w-[50px]'/>
                  </div>
                </div>
                
                <div className="grid gap-4">

                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={profileData.name}
                        onChange={handleInputChange('name')}
                        className="mt-1"
                      />
                    </div>
                
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange('email')}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="flex bg-dynamic text-white ms-auto" 
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;