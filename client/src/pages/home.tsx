import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UploadArea from "@/components/upload-area";
import AdSpace from "@/components/ad-space";
import { useAuth } from "@/lib/auth";
import { 
  Expand, 
  FileImage, 
  SquareFunction, 
  FolderOutput, 
  Smartphone, 
  Combine, 
  Crop,
  Code,
  Zap,
  Shield,
  MonitorSpeaker,
  Crown
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const handleFileSelect = (files: File[]) => {
    // For the home page, redirect to the appropriate tool
    console.log('Files selected:', files);
  };

  const tools = [
    {
      icon: Expand,
      title: "Image Resizer",
      description: "Resize images to any dimension while maintaining aspect ratio",
      href: "/tools/resize",
      color: "blue"
    },
    {
      icon: FileImage,
      title: "PNG to JPG",
      description: "Convert PNG images to JPG format for smaller file sizes",
      href: "/tools/png-to-jpg",
      color: "green"
    },
    {
      icon: SquareFunction,
      title: "PNG to SVG",
      description: "Convert PNG to scalable SVG vector format",
      href: "/tools/png-to-svg",
      color: "purple"
    },
    {
      icon: FolderOutput,
      title: "WebP to PNG",
      description: "Convert modern WebP format to PNG for compatibility",
      href: "/tools/webp-to-png",
      color: "orange"
    },
    {
      icon: Smartphone,
      title: "HEIC to JPG",
      description: "Convert iPhone HEIC photos to standard JPG format",
      href: "/tools/heic-to-jpg",
      color: "red"
    },
    {
      icon: Combine,
      title: "Image Compressor",
      description: "Reduce image file size while maintaining quality",
      href: "/tools/compress",
      color: "indigo"
    },
    {
      icon: Crop,
      title: "Crop Image",
      description: "Crop images to focus on important areas",
      href: "/tools/crop",
      color: "teal"
    },
    {
      icon: Code,
      title: "HTML to Image",
      description: "Convert HTML content to high-quality images",
      href: "/tools/html-to-image",
      color: "yellow"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; button: string }> = {
      blue: { bg: "bg-blue-100", icon: "text-blue-600", button: "bg-blue-600 hover:bg-blue-700" },
      green: { bg: "bg-green-100", icon: "text-green-600", button: "bg-green-600 hover:bg-green-700" },
      purple: { bg: "bg-purple-100", icon: "text-purple-600", button: "bg-purple-600 hover:bg-purple-700" },
      orange: { bg: "bg-orange-100", icon: "text-orange-600", button: "bg-orange-600 hover:bg-orange-700" },
      red: { bg: "bg-red-100", icon: "text-red-600", button: "bg-red-600 hover:bg-red-700" },
      indigo: { bg: "bg-indigo-100", icon: "text-indigo-600", button: "bg-indigo-600 hover:bg-indigo-700" },
      teal: { bg: "bg-teal-100", icon: "text-teal-600", button: "bg-teal-600 hover:bg-teal-700" },
      yellow: { bg: "bg-yellow-100", icon: "text-yellow-600", button: "bg-yellow-600 hover:bg-yellow-700" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Free Image Resizer
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Easily resize images online for free.
          </p>

          <UploadArea onFileSelect={handleFileSelect} />

          {/* Processing Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Expand className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Resize</h3>
                <p className="text-gray-600 text-sm">Change image dimensions while maintaining quality</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Combine className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Combine</h3>
                <p className="text-gray-600 text-sm">Reduce file size without losing visual quality</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FolderOutput className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Convert</h3>
                <p className="text-gray-600 text-sm">Change format between JPG, PNG, WebP, and more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AdSpace />

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Image Tools & Converters</h2>
            <p className="text-xl text-gray-600">Professional image processing tools for every need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => {
              const colors = getColorClasses(tool.color);
              const Icon = tool.icon;
              
              return (
                <Card key={tool.href} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <Link href={tool.href}>
                      <Button className={`w-full ${colors.button} text-white`}>
                        {tool.title.includes('Convert') ? 'Convert' : 'Use Tool'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose imgWorld🌍?</h2>
            <p className="text-xl text-gray-600">Fast, secure, and professional image processing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process images in seconds with our optimized algorithms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your images are processed securely and deleted after use</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MonitorSpeaker className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
          </div>
        </div>
      </section>

      <AdSpace />

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
                <p className="text-gray-600 mb-6">Perfect for casual use</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Single image processing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">10MB file size limit</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Basic image tools</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-gray-400">✗</span>
                    <span className="text-gray-500">Includes advertisements</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <CardContent className="p-8 text-center bg-blue-600 text-white rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-1">$5.99</div>
                <p className="text-blue-100 mb-6">per month</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>Batch processing (up to 20 images)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>100MB file size limit</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>All image tools & converters</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>Secure SSL connection</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span>Pro badge & priority support</span>
                  </li>
                </ul>
                
                {user?.isPro ? (
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-50" disabled>
                    <Crown className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Link href="/auth?upgrade=true">
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-50">
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
                <p className="text-center text-blue-100 text-sm mt-2">Billed monthly via Dodo Payments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <i className="fas fa-globe text-2xl text-blue-400"></i>
                <span className="text-xl font-bold">imgWorld🌍</span>
              </div>
              <p className="text-gray-400">Professional image tools for everyone. Resize, compress, convert, and optimize your images online.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Image Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tools/resize" className="hover:text-white transition-colors">Image Resizer</Link></li>
                <li><Link href="/tools/compress" className="hover:text-white transition-colors">Image Compressor</Link></li>
                <li><Link href="/tools/crop" className="hover:text-white transition-colors">Crop Image</Link></li>
                <li><Link href="/tools/rotate" className="hover:text-white transition-colors">Rotate Image</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Converters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tools/png-to-jpg" className="hover:text-white transition-colors">PNG to JPG</Link></li>
                <li><Link href="/tools/png-to-svg" className="hover:text-white transition-colors">PNG to SVG</Link></li>
                <li><Link href="/tools/webp-to-png" className="hover:text-white transition-colors">WebP to PNG</Link></li>
                <li><Link href="/tools/heic-to-jpg" className="hover:text-white transition-colors">HEIC to JPG</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 imgWorld🌍. All rights reserved. Built with ❤️ for creators worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
