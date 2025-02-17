// components/providers/Provider.tsx
"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation"; // Updated to next/navigation
import { destroyCookie } from "nookies";
import henceforthApi, { API_ROOT } from "@/utils/henceforthApi";
import { formatDuration } from "date-fns";
import toast from "react-hot-toast";
// import { company } from "../layout/app-sidebar";

interface UserInfo {
  access_token?: string;
  [key: string]: any;
}
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai" | "system" | "inactivity";
  timestamp: number;
  actions?: "end_chat" | "continue_chat" | null;
}

interface GlobalContextType {
  logout: () => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  userInfo: UserInfo | null;
  stopSpaceEnter: (event: React.KeyboardEvent) => boolean;
  getProfile: () => Promise<void>;
  formatDuration: (seconds: number) => string;
  Toast: any;

  setIsCallActive: any;
  isCallActive: any;
  getAgentandScriptDetails: any;
  agentDetails: any;
  showForm: any;
  setShowForm: any;
  chatId: any;
  setChatId: any;
  formData: any;
  setFormData: any;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  panelSwitch: boolean;
  setPanelSwitch: any;
  decodedToken: any;
  setDecodedToken: any;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
  userInfo?: UserInfo;
}

type ToastFunction = (msg: any) => void;
export function GlobalProvider({
  children,
  userInfo: initialUserInfo,
}: GlobalProviderProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    initialUserInfo || null
  );
  const [isCallActive, setIsCallActive] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [chatId, setChatId] = useState("");

  const [agentDetails, setAgentDetails] = useState({
    agent_name: "",
    agent_voice: "",
    chat_prompt: "",
    call_first_message: "",
    call_prompt: "",
    chat_first_message: "",
    agent_image: "",
    page_title: "",
    page_description: "",
    page_url: "",
    secret_key: "",
  });
  console.log(initialUserInfo, "initialUserInfo");
  const [panelSwitch, setPanelSwitch] = useState(false);

  if (userInfo?.access_token) {
    henceforthApi.setToken(userInfo.access_token);
  }
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    email: "",
  });
  const [decodedToken, setDecodedToken] = useState<any | null>({
    agent_id: "",
  });
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
    if (seconds < 0 || isNaN(seconds)) return "0 s";

    // Define time units
    const units = [
      { name: "d", seconds: 86400 },
      { name: "h", seconds: 3600 },
      { name: "m", seconds: 60 },
      { name: "s", seconds: 1 },
    ];

    // Find the appropriate unit and calculate
    for (const unit of units) {
      if (seconds >= unit.seconds) {
        const value = Math.floor(seconds / unit.seconds);
        const remainder = seconds % unit.seconds;

        // Construct the primary unit part
        let result = `${value} ${unit.name}`;

        // Add secondary unit if there's a significant remainder
        if (unit.name !== "s" && remainder > 0) {
          const nextUnit = units[units.indexOf(unit) + 1];
          const nextValue = Math.floor(remainder / nextUnit.seconds);

          if (nextValue > 0) {
            result += ` ${nextValue} ${nextUnit.name}`;
          }
        }

        return result;
      }
    }

    return "0 s";
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
    console.log("fgjfvjdvjjhvcjhdsksj");
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
      console.error("Profile fetch error:", error);
    }
  };

  const getAgentandScriptDetails = async (agentId: string) => {
    try {
      const apiRes = await fetch(`https://${API_ROOT}agent/${agentId}`, {
        method: "GET",
      });
      const response = await apiRes.json();

      const rgbColor = await hexToRgb(response?.data?.script_data?.colour);
      const colorAccents = await generateColorAccents(rgbColor);
      const fontRGBColor = await hexToRgb(
        response?.data?.script_data?.font_colour
      );
      const fontColorAccents = await generateColorAccents(fontRGBColor);
      console.log(colorAccents, "colorAccents");
      console.log(fontColorAccents, "fontColorAccents");
      //font accent colors
      document.documentElement.style.setProperty(
        "--dynamic-font-color",
        fontColorAccents?.originalColor
      );
      document.documentElement.style.setProperty(
        "--light-dynamic-font-color",
        fontColorAccents?.lightColor
      );
      document.documentElement.style.setProperty(
        "--medium-dynamic-font-color",
        fontColorAccents?.mediumColor
      );

      //project accent colors
      document.documentElement.style.setProperty(
        "--dynamic-color",
        colorAccents?.originalColor
      );
      document.documentElement.style.setProperty(
        "--light-dynamic-color",
        colorAccents?.lightColor
      );
      document.documentElement.style.setProperty(
        "--medium-dynamic-color",
        colorAccents?.mediumColor
      );
      setAgentDetails({
        ...agentDetails,
        agent_name: response?.data?.name,
        agent_voice: response?.data?.voice,

        agent_image: response?.data?.image,
        chat_prompt: response?.data?.chat_prompt,
        call_first_message: response?.data?.call_first_message,
        call_prompt: response?.data?.call_prompt,
        chat_first_message: response?.data?.chat_first_message,
        page_title: response?.data?.script_data?.title,
        page_description: response?.data?.script_data?.description,
        page_url: response?.data?.script_data?.url,
        secret_key: response?.data?.script_data?.key,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const hexToRgb = async (hex: string) => {
    hex = hex ? hex : "#F0BB78";
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    console.log(r, g, b, "rgb");
    return `${r},${g},${b}`;
  };
  async function generateColorAccents(rgbString: string) {
    // Parse the input RGB string into separate color components
    console.log(rgbString, "rgbString");
    const [r, g, b] = rgbString.split(",").map(Number);
    console.log(r, g, b, "rgbString");

    // Function to ensure color values stay within 0-255 range
    const clamp = (value: number) => Math.min(255, Math.max(0, value));

    // Original color (unchanged)
    const originalColor = `${r}, ${g}, ${b}`;

    // Light accent (increase brightness)
    const lightColor = `${clamp(r + 30)}, ${clamp(g + 30)}, ${clamp(b + 30)}`;

    // Medium accent (slightly darker)
    const mediumColor = `${clamp(r - 30)}, ${clamp(g - 30)}, ${clamp(b - 30)}`;

    return {
      originalColor,
      lightColor,
      mediumColor,
    };
  }

  const contextValue: GlobalContextType = {
    messages,
    setMessages,
    decodedToken,
    setDecodedToken,

    logout,
    formData,
    setFormData,
    chatId,
    setChatId,
    showForm,
    setShowForm,
    isCallActive,
    setIsCallActive,
    setUserInfo,
    userInfo,

    stopSpaceEnter,
    getProfile,
    formatDuration,
    Toast,
    getAgentandScriptDetails,
    agentDetails,
    panelSwitch,
    setPanelSwitch,
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
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}

export default GlobalProvider;
