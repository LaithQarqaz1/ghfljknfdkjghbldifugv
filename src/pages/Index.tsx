import React from 'react';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Settings, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج",
        description: "إلى اللقاء!",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // عرض شاشة التحميل أثناء فحص حالة المصادقة
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'var(--gradient-secondary)' }}>
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={() => {}} />;
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'var(--gradient-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Card className="form-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">مرحباً بك</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="secondary-button">
                    <Settings className="h-4 w-4 ml-2" />
                    الإعدادات
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="secondary-button">
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="form-card hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">الملف الشخصي</h3>
              <p className="text-muted-foreground">إدارة معلوماتك الشخصية</p>
            </CardContent>
          </Card>

          <Card className="form-card hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">الإعدادات</h3>
              <p className="text-muted-foreground">تخصيص تجربتك</p>
            </CardContent>
          </Card>

          <Card className="form-card hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">النشاط</h3>
              <p className="text-muted-foreground">عرض آخر الأنشطة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
