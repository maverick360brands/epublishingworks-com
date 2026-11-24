import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Layout for the main site: full navigation header and footer.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
