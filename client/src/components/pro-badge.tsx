import { Crown } from "lucide-react";

export default function ProBadge() {
  return (
    <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 text-sm font-semibold">
      <Crown className="h-3 w-3" />
      <span>PRO</span>
    </div>
  );
}
