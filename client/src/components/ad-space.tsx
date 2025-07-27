import { useAuth } from "@/lib/auth";

interface AdSpaceProps {
  type?: 'banner' | 'square';
  className?: string;
}

export default function AdSpace({ type = 'banner', className = '' }: AdSpaceProps) {
  const { user } = useAuth();

  // Don't show ads for pro users
  if (user?.isPro) {
    return null;
  }

  const dimensions = type === 'banner' ? '728x90' : '300x250';
  const height = type === 'banner' ? 'h-24' : 'h-64';

  return (
    <section className={`py-8 bg-gray-100 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 ${height} flex flex-col items-center justify-center`}>
          <div className="text-gray-400 mb-2">
            <i className="fas fa-ad text-2xl"></i>
          </div>
          <p className="text-gray-500 text-sm">Advertisement Space</p>
          <p className="text-xs text-gray-400 mt-1">{dimensions} AdSense Integration</p>
          {/* Google AdSense code would be inserted here */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            // data-ad-client={process.env.VITE_ADSENSE_CLIENT_ID}
          ></script>
        </div>
      </div>
    </section>
  );
}
