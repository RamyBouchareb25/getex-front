import { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";

const AuthLayout = ({children}:{children:ReactNode}) => {
    return (
        <div className="relative min-h-screen">
            {/* Language Switcher - Fixed position */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            {children}
        </div>
    );
}
 
export default AuthLayout;