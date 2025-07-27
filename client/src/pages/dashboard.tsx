import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProBadge from "@/components/pro-badge";
import { Crown, BarChart3, Clock, HardDrive, Zap } from "lucide-react";

interface DashboardStats {
  totalProcessed: number;
  toolsUsed: string[];
  totalSizeMB: number;
  averageProcessingTime: number;
  recentLogs: Array<{
    id: string;
    toolType: string;
    inputFormat: string;
    outputFormat: string;
    fileSizeMB: string;
    processingTimeMs: number;
    createdAt: string;
  }>;
  isPro: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    fetchDashboardStats();
  }, [user, setLocation]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      // In a real implementation, this would redirect to Dodo Payments
      // For now, we'll simulate the upgrade
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptionId: 'sub_' + Date.now() })
      });

      if (response.ok) {
        window.location.reload(); // Refresh to update user state
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.isPro && <ProBadge />}
              {!user?.isPro && (
                <Button onClick={handleUpgradeToPro} className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Images Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProcessed}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tools Used</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.toolsUsed.length}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Size Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSizeMB.toFixed(1)} MB</p>
                </div>
                <HardDrive className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">{(stats.averageProcessingTime / 1000).toFixed(1)}s</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Subscription Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Plan:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user?.isPro 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.isPro ? 'Pro' : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">File Size Limit:</span>
                  <span className="text-gray-600">{user?.isPro ? '100 MB' : '10 MB'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Batch Processing:</span>
                  <span className="text-gray-600">{user?.isPro ? 'Up to 20 images' : 'Single image'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Advertisements:</span>
                  <span className="text-gray-600">{user?.isPro ? 'Ad-free' : 'With ads'}</span>
                </div>
                
                {!user?.isPro && (
                  <div className="pt-4 border-t">
                    <Button onClick={handleUpgradeToPro} className="w-full bg-blue-600 hover:bg-blue-700">
                      Upgrade to Pro - $5.99/month
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm capitalize">{log.toolType}</p>
                        <p className="text-xs text-gray-500">
                          {log.inputFormat.replace('image/', '')} → {log.outputFormat?.replace('image/', '') || 'processed'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{parseFloat(log.fileSizeMB).toFixed(1)} MB</p>
                        <p className="text-xs text-gray-500">{(log.processingTimeMs / 1000).toFixed(1)}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent activity. Start processing images to see your activity here!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/tools/resize">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Resize Image</span>
                </Button>
              </Link>
              <Link href="/tools/png-to-jpg">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">PNG to JPG</span>
                </Button>
              </Link>
              <Link href="/tools/webp-to-png">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <HardDrive className="h-6 w-6" />
                  <span className="text-sm">WebP to PNG</span>
                </Button>
              </Link>
              <Link href="/tools/heic-to-jpg">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">HEIC to JPG</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
