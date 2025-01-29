"use client"
import React, { useEffect, useRef, useState } from 'react';


import PageContainer from '@/components/layout/page-container';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import countryCode from "@/utils/countryCode.json";
import { Button } from '@/components/ui/button';
import AIChat from '@/app/AIChat';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import "@/app/globals.css";  
type Message = {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
};




const Dashboard = () => {
 

  return (
  
      
<div className='pt-1'> <AIChat/></div>
           

  );
};

export default function DashboardPage() {
    return (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    );
   }