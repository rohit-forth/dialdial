"use client"
import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import henceforthApi from '@/utils/henceforthApi';
import { useGlobalContext } from '@/components/providers/Provider';
import { useRouter } from 'next/navigation';

import { setCookie } from 'nookies';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { set } from 'date-fns';
export default function LoginPage() {

  const router=useRouter();
  const [email, setEmail] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const { setUserInfo,Toast } = useGlobalContext();
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const payload={
      email: email,
      password: password,
      
    }
   try {

      const apiRes=await henceforthApi.SuperAdmin.login(payload,);
      setUserInfo(apiRes?.data);

      setCookie(null, "COOKIES_ADMIN_ACCESS_TOKEN", apiRes?.data?.access_token, {
        path: "/",
      })
      router.push('/dashboard');
      console.log(apiRes?.data,"details available");
   } catch (error: any) {
      if (error?.response) {
        toast.error(error?.response?.body?.message);
      } else {
        toast.error("An unexpected error occurred");
      }
   }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="old">Password</Label>
            <div className="relative">
              <Input
                id="old"
                type={visibility ? "text" : "password"}
           
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setVisibility(!visibility)}
              >
                {visibility? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
            <Button type="submit" className="w-full common-btn text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}