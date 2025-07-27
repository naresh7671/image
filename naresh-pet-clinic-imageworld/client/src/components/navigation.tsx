import { Link } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {/* Resize Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
            Resize
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              <Link href="/tools/image-resizer">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                  Image Resizer
                </div>
              </Link>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Batch Resize
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Aspect Ratio
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Crop Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
            Crop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Crop Image
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Circle Crop
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Square Crop
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Compress Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
            Compress
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Compress JPG
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Compress PNG
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Compress WebP
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Convert Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
            Convert
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-56 p-2">
              <Link href="/tools/png-to-jpg">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                  PNG to JPG
                </div>
              </Link>
              <Link href="/tools/png-to-svg">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                  PNG to SVG
                </div>
              </Link>
              <Link href="/tools/webp-to-png">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                  WebP to PNG
                </div>
              </Link>
              <Link href="/tools/heic-to-jpg">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                  HEIC to JPG
                </div>
              </Link>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                HTML to Image
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* More Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
            More
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Rotate Image
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Upscale Image
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Image Editor
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
            Pricing
          </a>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
