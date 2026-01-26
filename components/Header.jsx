"use client";

import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { LayoutDashboard, PenBox, Moon, Sun, Menu, X, User } from 'lucide-react';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-8xl mx-auto">
        <Link href="/" className="font-bold text-2xl text-blue-600 dark:text-blue-400">
          TRACO
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle - Always Visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <PenBox size={18} />
                  <span>Add Transaction</span>
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button (Visible only on small screens) */}
          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              {/* Keep UserButton visible even on mobile for quick access or put in menu */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Signed Out - Desktop */}
          <div className="hidden md:flex gap-2">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton forceRedirectUrl="/dashboard">
                <Button className="bg-blue-600 text-white">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Options Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b px-4 py-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-200">
          <SignedIn>
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <LayoutDashboard size={20} />
                Dashboard
              </Button>
            </Link>
            <Link href="/transaction/create" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full justify-start gap-3 bg-blue-600 text-white h-12">
                <PenBox size={20} />
                Add Transaction
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="w-full h-12">Sign In</Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/dashboard">
              <Button className="w-full bg-blue-600 text-white h-12">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Header;