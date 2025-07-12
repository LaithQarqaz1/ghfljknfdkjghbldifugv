import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';

interface UserData {
  username: string;
  email: string;
  balance: number;
  useruid: string;
  createdAt: string;
}

export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          // إنشاء بيانات مستخدم افتراضية إذا لم تكن موجودة
          const defaultUserData: UserData = {
            username: user.email?.split('@')[0] || 'مستخدم',
            email: user.email || '',
            balance: 0,
            useruid: user.uid,
            createdAt: new Date().toISOString()
          };
          
          await setDoc(docRef, defaultUserData);
          setUserData(defaultUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return { userData, loading };
}