import { Built } from "./components/Built";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Install } from "./components/Install";
import { Keys } from "./components/Keys";
import { Nav } from "./components/Nav";
import { NotDone } from "./components/NotDone";
import { Programs } from "./components/Programs";
import { Lineage } from "./components/Lineage";
import { Signal } from "./components/Signal";
import { Splash } from "./components/Splash";
import { StatusStrip } from "./components/StatusStrip";
import { Tour } from "./components/Tour";
import { WaysOut } from "./components/WaysOut";

export function App() {
  return (
    <>
      <Splash />
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
        <Lineage />
        <Install />
      </main>
      <Footer />
      <StatusStrip />
    </>
  );
}
