import { Chrome } from "./components/Chrome";
import { Contact } from "./components/Contact";
import { FormsMorph } from "./components/FormsMorph";
import { Hero } from "./components/Hero";
import { LightType } from "./components/LightType";
import { Chips, Material } from "./components/Material";
import { Works } from "./components/Works";
import { useReveal } from "./hooks/useScroll";

export default function App() {
  useReveal();

  return (
    <div className="site">
      <Chrome />
      <main>
        <Hero />
        <FormsMorph />
        <LightType />
        <Works />
        <Chips />
        <Material />
      </main>
      <Contact />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
