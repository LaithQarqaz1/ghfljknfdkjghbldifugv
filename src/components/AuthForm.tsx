import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FormType = 'login' | 'register' | 'reset';

interface AuthFormProps {
  onAuth?: (success: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const [currentForm, setCurrentForm] = useState<FormType>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setErrors('يرجى إدخال البريد الإلكتروني');
      return false;
    }
    if (currentForm !== 'reset' && !formData.password) {
      setErrors('يرجى إدخال كلمة المرور');
      return false;
    }
    if (currentForm === 'register' && !formData.username) {
      setErrors('يرجى إدخال اسم المستخدم');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (currentForm === 'reset') {
        setSuccessMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
      } else if (currentForm === 'register') {
        setSuccessMessage('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني');
      } else {
        onAuth?.(true);
      }
    }, 1500);
  };

  const getFormTitle = () => {
    switch (currentForm) {
      case 'login': return 'تسجيل الدخول';
      case 'register': return 'إنشاء حساب جديد';
      case 'reset': return 'استعادة كلمة المرور';
    }
  };

  const getButtonText = () => {
    if (loading) return 'جاري المعالجة...';
    switch (currentForm) {
      case 'login': return 'دخول';
      case 'register': return 'إنشاء الحساب';
      case 'reset': return 'إرسال رابط الاستعادة';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ background: 'var(--gradient-secondary)' }}>
      <Card className="w-full max-w-md form-card">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            {getFormTitle()}
          </CardTitle>
          <p className="text-muted-foreground">
            {currentForm === 'login' && 'أهلاً بك مرة أخرى'}
            {currentForm === 'register' && 'انضم إلينا اليوم'}
            {currentForm === 'reset' && 'سنساعدك في استعادة حسابك'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {currentForm === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-right flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input text-right"
                  dir="rtl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-right flex items-center gap-2">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input text-right"
                dir="rtl"
              />
            </div>

            {currentForm !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input text-right"
                  dir="rtl"
                />
              </div>
            )}

            <Button 
              type="submit" 
              variant="gradient"
              className="w-full text-white font-semibold py-3"
              disabled={loading}
            >
              {getButtonText()}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-4">
            {currentForm === 'login' && (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:text-primary-foreground hover:bg-primary/10"
                  onClick={() => setCurrentForm('reset')}
                >
                  نسيت كلمة المرور؟
                </Button>
                <Button
                  variant="outline"
                  className="w-full secondary-button"
                  onClick={() => setCurrentForm('register')}
                >
                  ليس لديك حساب؟ إنشاء حساب جديد
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {(currentForm === 'register' || currentForm === 'reset') && (
              <Button
                variant="outline"
                className="w-full secondary-button"
                onClick={() => setCurrentForm('login')}
              >
                العودة لتسجيل الدخول
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;