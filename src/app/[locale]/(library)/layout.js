import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function LibraryLayout({ children }) {
  return (
    <>
      {/* First viewport: Header + Navbar + Library content */}
      <div className="flex min-h-screen flex-col">
        <Header />
        <Navbar />

        <main className="flex flex-1 flex-col">{children}</main>
      </div>

      {/* Footer starts after the first viewport */}
      <Footer />
    </>
  );
}
