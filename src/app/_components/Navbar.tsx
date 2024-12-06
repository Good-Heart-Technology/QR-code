'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">QR-23</Link>
        </div>

        {/* Theme Toggle and Configuration */}
        <div className="ml-auto flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.push('/configure')}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Open configuration</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;