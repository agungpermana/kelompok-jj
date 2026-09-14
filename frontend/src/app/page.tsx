import React from "react";
import TrashureLogo from "@/components/TrashureLogo";
import BankSampahIllustration from "@/components/BankSampahIllustration";
import LeafDecorations from "@/components/LeafDecorations";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#ebf5ee] via-[#e1efe5] to-[#ebf3ee] flex flex-col justify-between overflow-hidden">
      {/* Ambient Leaf Floating Background Accents */}
      <LeafDecorations />

      {/* Top Header Logo */}
      <header className="relative z-10 p-6 sm:p-10 lg:pl-16 lg:pt-12">
        <TrashureLogo size="md" />
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 py-4 sm:py-8">
        {/* Left Side: Bank Sampah & Bins Illustration */}
        <div className="hidden lg:flex flex-1 justify-start items-end max-w-[500px] xl:max-w-[560px] pb-2">
          <BankSampahIllustration className="w-full" />
        </div>

        {/* Center/Right Side: Elevated Login Card */}
        <div className="w-full lg:flex-1 flex justify-center lg:justify-center items-center">
          <LoginForm />
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 text-center py-6 px-4 text-xs sm:text-[13px] text-gray-500/80 tracking-normal select-none">
        © 2024 Trashure. Semua hak dilindungi.
      </footer>
    </main>
  );
}
