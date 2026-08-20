// src/app/[locale]/(content)/layout.js 

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ContentLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
