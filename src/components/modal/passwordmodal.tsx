import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, Eye, EyeOff, Check, AlertCircle, KeySquare } from "lucide-react";
import { Icons } from "@/components/icons";
import toast from 'react-hot-toast';
import henceforthApi from '@/utils/henceforthApi';
import { useGlobalContext } from '../providers/Provider';

const PasswordChangeDialog = () => {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {Toast}=useGlobalContext();
  const [visibility, setVisibility] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic validation
    // if (!oldPassword || !newPassword || !confirmPassword) {
    //   setError('All fields are required');
    //   return;
    // }

    // if (newPassword !== confirmPassword) {
    //   setError('New passwords do not match');
    //   return;
    // }

    // if (newPassword.length < 8) {
    //   setError('New password must be at least 8 characters long');
    //   return;
    // }

    const payload = {
      oldPassword,
      newPassword,
      confirmPassword
    }

    try {
      const apires = await henceforthApi.SuperAdmin.changePassword(payload);
      toast.success("Password Changed Successfully");
    } catch (error: any) {
      if (error?.response) {
        toast.error(error?.response?.body?.message);
      } else {
        toast.error("An unexpected error occurred");
      }
   }finally{
    setSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOpen(false);
    setSuccess(false);
    setVisibility({ old: false, new: false, confirm: false });
  }

    // Simulate API call
    // setTimeout(() => {
    //   setSuccess(true);
    //   // Reset form
    //   setOldPassword('');
    //   setNewPassword('');
    //   setConfirmPassword('');
    //   // Close dialog after 1.5s
    //   setTimeout(() => {
    //     setOpen(false);
    //     setSuccess(false);
    //   },800);
    // }, 1000);
  };

  const toggleVisibility = (field: 'old' | 'new' | 'confirm') => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <li className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md">
          <span className="flex items-center gap-2">
          <KeySquare />Change Password
          </span>
          <Icons.RightArrow />
        </li>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" >
              {/* <AlertCircle className="h-4 w-4" /> */}
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-600 border-green-200 flex items-center">
             
              <AlertDescription>Password changed successfully!</AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="old">Current Password</Label>
            <div className="relative">
              <Input
                id="old"
                type={visibility.old ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleVisibility('old')}
              >
                {visibility.old ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <div className="relative">
              <Input
                id="new"
                type={visibility.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleVisibility('new')}
              >
                {visibility.new ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={visibility.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleVisibility('confirm')}
              >
                {visibility.confirm ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {/* <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button> */}
            <Button type="submit" className='bg-dynamic text-white'>
              Change Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeDialog;