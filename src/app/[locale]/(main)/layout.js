// src/app/[locale]/(main)/layout.js

import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
