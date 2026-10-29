import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import PaintGrid from "./components/PaintGrid";
import Palette from "./components/Palette";
import ShapeLab from "./components/ShapeLab";
import TypeSection from "./components/TypeSection";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grain-overlay" aria-hidden />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Palette />
        <TypeSection />
        <ShapeLab />
        <Gallery />
        <PaintGrid />
        <Contact />
      </main>
    </div>
  );
}
