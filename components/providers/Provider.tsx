// components/providers/Provider.tsx
"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { useRouter } from "next/navigation"; // Updated to next/navigation
import { destroyCookie } from "nookies";
import henceforthApi from "@/utils/henceforthApi";
import { formatDuration } from "date-fns";
import toast from "react-hot-toast";

interface UserInfo {
  access_token?: string;
  [key: string]: any;
}

interface GlobalContextType {
  logout: () => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  userInfo: UserInfo | null;
  stopSpaceEnter: (event: React.KeyboardEvent) => boolean;
  getProfile: () => Promise<void>;
  formatDuration: (seconds: number) => string;
  Toast:any
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
  userInfo?: UserInfo;
}
type ToastFunction = (msg: any) => void;
export function GlobalProvider({ children, userInfo: initialUserInfo }: GlobalProviderProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(initialUserInfo || null);
  console.log(initialUserInfo, "initialUserInfo");

  if (userInfo?.access_token) {
    henceforthApi.setToken(userInfo.access_token);
  }

  const stopSpaceEnter = (event: React.KeyboardEvent): boolean => {
    if (event.target instanceof HTMLInputElement) {
      if (event.target.value.length === 0 && event.key === " ") {
        event.preventDefault();
        return false;
      }
      
      // Allow only letters and space
      if (!/^[a-zA-Z ]$/.test(event.key) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  };

  const formatDuration = (seconds: number): string => {
    // Handle invalid or negative inputs
    if (seconds < 0 || isNaN(seconds)) return '0 s';
  
    // Define time units
    const units = [
      { name: 'd', seconds: 86400 },
      { name: 'h', seconds: 3600 },
      { name: 'm', seconds: 60 },
      { name: 's', seconds: 1 }
    ];
  
    // Find the appropriate unit and calculate
    for (const unit of units) {
      if (seconds >= unit.seconds) {
        const value = Math.floor(seconds / unit.seconds);
        const remainder = seconds % unit.seconds;
  
        // Construct the primary unit part
        let result = `${value} ${unit.name}`;
  
        // Add secondary unit if there's a significant remainder
        if (unit.name !== 's' && remainder > 0) {
          const nextUnit = units[units.indexOf(unit) + 1];
          const nextValue = Math.floor(remainder / nextUnit.seconds);
          
          if (nextValue > 0) {
            result += ` ${nextValue} ${nextUnit.name}`;
          }
        }
  
        return result;
      }
    }
  
    return '0 s';
  };

  const success: ToastFunction = (message: string) => {
    toast.success(message, {
      duration: 2000,
      style: {
        fontSize: "13px",
        backgroundColor: "#fff",
      },
    });
  };
  // Error toast
  const error: ToastFunction = (err: any) => {
    const errorBody = err?.response?.body;
    const message =
      typeof err === "string" ? err : errorBody?.message || "An error occurred";
    toast.error(message, {
      duration: 2000,
      style: {
        fontSize: "13px",
        backgroundColor: "#fff",
      },
    });
  };
  // Toast object
  const Toast = {
    success,
    error,
  };

  const logout = async () => {
    console.log("fgjfvjdvjjhvcjhdsksj")
    setUserInfo(null);
    destroyCookie(null, "COOKIES_ADMIN_ACCESS_TOKEN", {
      path: "/",
    });
    router.replace("/");
  };

  const getProfile = async () => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.profile();
      setUserInfo(apiRes?.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      
     
    }
  };

  const contextValue: GlobalContextType = {
    logout,
    setUserInfo,
    userInfo,
    stopSpaceEnter,
    getProfile,
    formatDuration,
    Toast
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook to use the global context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}

export default GlobalProvider;