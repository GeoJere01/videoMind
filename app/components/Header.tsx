"use client";

import Link from "next/link";
import AgentPulse from "./AgentPulse";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const appearance = {
  elements: {
    formButtonPrimary:
      "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500",
    card: "bg-white shadow-xl border border-gray-100",
    headerTitle: "text-2xl font-bold text-gray-900",
    headerSubtitle: "text-gray-600",
    socialButtonsBlockButton:
      "border border-gray-300 hover:bg-gray-50 transition-all",
    socialButtonsBlockButtonText: "text-gray-600 font-medium",
    dividerLine: "bg-gray-200",
    dividerText: "text-gray-500",
    formFieldLabel: "text-gray-700",
    formFieldInput:
      "border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg",
    footerActionLink: "text-blue-600 hover:text-blue-700",
    identityPreviewText: "text-gray-700",
    identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
  },
  layout: {
    socialButtonsPlacement: "bottom" as const,
    showOptionalFields: true,
  },
} as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 px-4 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-4 flex-shrink-0"
          >
            <AgentPulse size="small" color="blue" />
            <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              VideoMind
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <SignedIn>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                >
                  Manage Plan
                </Button>
              </Link>

              <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonPopoverCard:
                        "bg-white shadow-xl border border-gray-100",
                      userButtonPopoverFooter: "border-t border-gray-100",
                      userButtonPopoverActionButton:
                        "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal" appearance={appearance}>
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <SignedIn>
              <div className="flex items-center gap-2">
                <div className="p-1.5 w-8 h-8 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonPopoverCard:
                          "bg-white shadow-xl border border-gray-100",
                        userButtonPopoverFooter: "border-t border-gray-100",
                        userButtonPopoverActionButton:
                          "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                      },
                    }}
                  />
                </div>
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu size={24} className="text-gray-700" />
                </button>
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal" appearance={appearance}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-gray-100">
            <SignedIn>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                >
                  Manage Plan
                </Button>
              </Link>
            </SignedIn>
          </div>
        )}
      </div>
    </header>
  );
}
