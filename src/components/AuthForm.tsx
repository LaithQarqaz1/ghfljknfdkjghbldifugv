import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  const translateFirebaseError = (errorCode: string): string => {
    const errors: { [key: string]: string } = {
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/user-disabled': 'تم تعطيل الحساب',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم من قبل',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/operation-not-allowed': 'العملية غير مسموحة',
      'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
      'auth/too-many-requests': 'كثرة المحاولات، يرجى المحاولة لاحقاً',
      'auth/network-request-failed': 'خطأ في الشبكة، تحقق من الاتصال'
    };
    return errors[errorCode] || 'حدث خطأ أثناء العملية';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    try {
      if (currentForm === 'login') {
        // تسجيل الدخول
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        if (!userCredential.user.emailVerified) {
          await signOut(auth);
          setErrors('يرجى تأكيد البريد الإلكتروني أولاً');
          return;
        }

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "أهلاً بك مرة أخرى!",
        });
        onAuth?.(true);

      } else if (currentForm === 'register') {
        // إنشاء حساب جديد
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // حفظ بيانات المستخدم في Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: formData.username,
          email: formData.email,
          balance: 0,
          useruid: userCredential.user.uid,
          createdAt: new Date().toISOString()
        });

        // إرسال رابط تفعيل البريد الإلكتروني
        await sendEmailVerification(userCredential.user);
        await signOut(auth);

        setSuccessMessage('تم إنشاء الحساب بنجاح! تم إرسال رابط التفعيل إلى بريدك الإلكتروني');
        
        toast({
          title: "تم إنشاء الحساب",
          description: "يرجى تفعيل البريد الإلكتروني",
        });

      } else if (currentForm === 'reset') {
        // استعادة كلمة المرور
        await sendPasswordResetEmail(auth, formData.email);
        setSuccessMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
        
        toast({
          title: "تم إرسال الرابط",
          description: "تحقق من بريدك الإلكتروني",
        });
      }

    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrors(translateFirebaseError(error.code));
    } finally {
      setLoading(false);
    }
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