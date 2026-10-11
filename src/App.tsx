import { Built } from "./components/Built";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Install } from "./components/Install";
import { Keys } from "./components/Keys";
import { Nav } from "./components/Nav";
import { NotDone } from "./components/NotDone";
import { Programs } from "./components/Programs";
import { Signal } from "./components/Signal";
import { StatusStrip } from "./components/StatusStrip";
import { Tour } from "./components/Tour";
import { WaysOut } from "./components/WaysOut";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Programs />
        <Tour />
        <Keys />
        <Built />
        <Signal />
        <WaysOut />
        <NotDone />
        <Install />
      </main>
      <Footer />
      <StatusStrip />
    </>
  );
}
