"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FormErrors {
  name?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import countryCode from "@/utils/countryCode.json";
import "flag-icons/css/flag-icons.min.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Phone,
  MessageSquare,
  User,
  ChevronsUpDown,
  Check,
  Loader2,
} from "lucide-react";
import NoHeaderLayout from "@/components/layout/NonHeaderLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useGlobalContext } from "@/components/providers/Provider";
import { useRouter, useSearchParams } from "next/navigation";
import henceforthApi from "@/utils/henceforthApi";
import { time } from "console";
import { parseCookies, setCookie } from "nookies";
import gladiatorIcon from "@/app/assets/images/hf_logo.png";

const AIAgentCardSkeleton = () => {
  return (

    <Card className="transform flex border-0 shadow-xl items-center transition-transform hover:scale-105 relative border-white/10 bg-zinc-900/60 backdrop-blur-xl border-beam">
      <CardContent className="p-6 w-96">
        <div className="flex flex-col items-center space-y-10">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <div className="animate-pulse bg-gray-200 w-full h-full" />
          </div>
          <div className="w-48 h-6">
            <div className="animate-pulse bg-gray-200 w-full h-full rounded" />
          </div>
          <div className="flex space-x-3 w-full">
            <div className="flex-1 h-10">
              <div className="animate-pulse bg-gray-200 w-full h-full rounded" />
            </div>
            <div className="flex-1 h-10">
              <div className="animate-pulse bg-gray-200 w-full h-full rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>


  );
};
const AIAgentCard = () => {
  const {
    formData,
    setFormData,
    setIsCallActive,
    setPanelSwitch,
    decodedToken,
    setDecodedToken,
    getAgentandScriptDetails,
    setShowForm,
    agentDetails,
    setMessages,
  } = useGlobalContext();
  const [errors, setErrors] = useState<FormErrors>({});
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<"call" | "chat">("call");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isAgentLoading, setIsAgentLoading] = useState(true);
  const validateForm = () => {
    const newErrors: FormErrors = {};

    // if (!formData.name.trim()) {
    //   newErrors.name = "Name is required";
    // }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // if (!formData.countryCode) {
    //   newErrors.countryCode = "Country code is required";
    // }

    // if (!formData.phone.trim()) {
    //   newErrors.phone = "Phone number is required";
    // } else if (!/^\d{10}$/.test(formData.phone)) {
    //   newErrors.phone = "Invalid phone number";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      if (formType === "call") {
        setIsCallActive(true);

        setPanelSwitch(true);
      } else {
      }

      setShowForm(false);
      console.log("Form submitted:", formData);
      // Handle your form submission logic here
      setIsOpen(false);
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/");
      }, 1000);
    }
  };

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  let timeout: any;
  useEffect(() => {
    async function decodeToken(token: string) {
      setCookie(null, "token", token, {
        maxAge: 2 * 60 * 60,
        path: "/", // the cookie will be available on all routes
      });
      try {
        // Replace URL-safe characters back
        const normalizedToken = token.replace(/-/g, "+").replace(/_/g, "/");

        // Add padding if needed
        const padding = normalizedToken.length % 4;
        const paddedToken = padding
          ? normalizedToken + "=".repeat(4 - padding)
          : normalizedToken;

        // Decode
        const decoded = Buffer.from(paddedToken, "base64").toString();
        const data = JSON.parse(decoded);

        setDecodedToken({
          agent_id: data?.agent_id,
        });
        // getAgentName(data?.agent_id);
        // getThemeColor(data?.script_id);
        await getAgentandScriptDetails(data?.agent_id);
        timeout = setTimeout(() => {
          setIsAgentLoading(false);
        }, 100);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }

    const token = searchParams.get("token") || parseCookies()?.token;
    if (token) {
      decodeToken(token);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [agentDetails?._id]);

  return (
    <div className="flex items-center justify-center w-full border-0">
      {isAgentLoading ? (
        <AIAgentCardSkeleton />
      ) : (
        <Card className=" transform  flex backdrop-blur-xl opacity-90 border-0 bg-dynamic shadow-xl items-center transition-transform hover:scale-105">
          <CardContent className="p-6 w-96 text-fontDynamic">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 border-2 rounded-full bg-white/15 border-fontDynamic">

                <Avatar className="w-24 h-24 border border-fontDynamic shadow-xl">
                  <AvatarImage
                    className="object-cover"
                    src={henceforthApi?.FILES?.imageOriginal(
                      agentDetails?.agent_image,
                      gladiatorIcon?.src
                    )}
                    alt="AI Agent"
                  />
                  <AvatarFallback delayMs={500}>
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Agent Name */}
              <h2 className="text-xl font-semibold ">
                {agentDetails?.agent_name}
              </h2>

              {/* Company Title and Description */}
              <div className="text-center text-lightFontDynamic">
                <p className="text-md font-semibold ">
                  {agentDetails?.page_title}
                </p>
                <p className="text-xs ">{agentDetails?.page_description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 w-full">
                <Button
                  className="relative flex-1 text-black/90 bg-lightFontDynamic overflow-hidden py-5 font-semibold rounded-lg transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
                  onClick={() => {
                    setFormType("call");
                    setIsOpen(true);
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4 " />
                    <span>Call</span>
                  </div>
                </Button>
                <Button
                  className="relative flex-1 text-black/90 bg-lightFontDynamic overflow-hidden py-5 font-semibold rounded-lg transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
                  onClick={() => {
                    setFormType("chat");
                    setIsOpen(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg text-dynamic">
          <DialogHeader>
            <DialogTitle>Contact Form</DialogTitle>
            <DialogDescription>
              Please fill in your details to{" "}
              {formType === "call" ? "schedule a call" : "start chatting"} with
              our AI Assistant
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex space-x-2">
                {/* <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    handleInputChange("countryCode", value)
                  }
                >
                  <SelectTrigger
                    className={`w-[120px] ${
                      errors.countryCode ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1 (US)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+91">+91 (IN)</SelectItem>
                  </SelectContent>
                </Select> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[120px] justify-between",
                        "text-muted-foreground"
                      )}
                    >
                      {formData?.countryCode ? (
                        <>
                          <span
                            className={
                              countryCode.find(
                                (country: any) =>
                                  country?.dial_code === formData.countryCode
                              )?.flagClass + " me-2"
                            }
                          ></span>
                          {
                            countryCode.find(
                              (country: any) =>
                                country?.dial_code === formData.countryCode
                            )?.dial_code
                          }
                        </>
                      ) : (
                        "Select"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search country code..." />
                      <CommandList>
                        <CommandEmpty>No country code found.</CommandEmpty>
                        <CommandGroup
                          className="
                          max-h-[200px] overflow-y-auto"
                        >
                          {countryCode?.map((country: any) => (
                            <CommandItem
                              value={country?.dial_code}
                              key={country?.dial_code}
                              onSelect={() => {
                                handleInputChange(
                                  "countryCode",
                                  country?.dial_code
                                );
                              }}
                            >
                              <span
                                className={country?.flagClass + " me-2"}
                              ></span>
                              <span>
                                {country?.name?.length > 12
                                  ? country?.name?.slice(0, 12) + "..."
                                  : country?.name}
                              </span>
                              ({country.dial_code})
                              <Check
                                className={cn(
                                  "ml-auto",
                                  country.dial_code === formData.countryCode
                                    ? "text-primary"
                                    : "text-transparent"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="Phone number"
                />
              </div>
              {(errors.countryCode || errors.phone) && (
                <p className="text-sm text-red-500">
                  {errors.countryCode || errors.phone}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="relative w-full overflow-hidden py-5 bg-gradient-to-br bg-fontDynamic text-black/80 font-semibold rounded-lg 
              transition-all duration-300 ease-out
             
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              before:absolute before:inset-0
              before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
              before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span className="text-md">
                  {isLoading
                    ? `${formType === "call"
                      ? "Initiating Call"
                      : "Initiating Chat"
                    }...`
                    : "Submit"}
                </span>
              </div>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function AgentCard() {
  return (
    <NoHeaderLayout>
      <AIAgentCard />
    </NoHeaderLayout>
  );
}
