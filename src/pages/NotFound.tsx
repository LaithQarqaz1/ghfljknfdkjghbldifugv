import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ background: 'var(--gradient-secondary)' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">عذراً! الصفحة غير موجودة</p>
        <a href="/" className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-primary to-accent rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
