"use client";
import React, { useEffect, useRef, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import AIChat from "@/app/AIChat";

import "@/app/globals.css";
type Message = {
  id: number;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
};

const Dashboard = () => {
  return (
    <div className="pt-1">
      <AIChat />
    </div>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
