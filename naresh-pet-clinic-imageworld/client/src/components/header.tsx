import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import ProBadge from "./pro-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe, Menu, X } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const resizeTools = [
    { label: "Image Resizer", href: "/tools/resize" },
    { label: "Batch Resize", href: "/tools/batch-resize" },
    { label: "Aspect Ratio", href: "/tools/aspect-ratio" },
  ];

  const cropTools = [
    { label: "Crop Image", href: "/tools/crop" },
    { label: "Circle Crop", href: "/tools/circle-crop" },
    { label: "Square Crop", href: "/tools/square-crop" },
  ];

  const compressTools = [
    { label: "Compress JPG", href: "/tools/compress-jpg" },
    { label: "Compress PNG", href: "/tools/compress-png" },
    { label: "Compress WebP", href: "/tools/compress-webp" },
  ];

  const convertTools = [
    { label: "PNG to JPG", href: "/tools/png-to-jpg" },
    { label: "PNG to SVG", href: "/tools/png-to-svg" },
    { label: "WebP to PNG", href: "/tools/webp-to-png" },
    { label: "HEIC to JPG", href: "/tools/heic-to-jpg" },
    { label: "HTML to Image", href: "/tools/html-to-image" },
  ];

  const moreTools = [
    { label: "Rotate Image", href: "/tools/rotate" },
    { label: "Upscale Image", href: "/tools/upscale" },
    { label: "Image Editor", href: "/tools/editor" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">imgWorld🌍</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <span>Resize</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resizeTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <span>Crop</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {cropTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <span>Compress</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {compressTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <span>Convert</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {convertTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <span>More</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.isPro && <ProBadge />}
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Signup
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/tools/resize" className="text-gray-700 hover:text-blue-600 py-2">
                Image Resizer
              </Link>
              <Link href="/tools/png-to-jpg" className="text-gray-700 hover:text-blue-600 py-2">
                PNG to JPG
              </Link>
              <Link href="/tools/webp-to-png" className="text-gray-700 hover:text-blue-600 py-2">
                WebP to PNG
              </Link>
              <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 py-2">
                Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
