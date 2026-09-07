import Navbar from "./components/Navbar";
import { HeroSection } from "./components/home";
import LoadingScreen from "./components/LoadingScreen";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-bg text-primary selection:bg-brand selection:text-white overflow-x-clip">
      <Navbar />
      <main className="overflow-x-clip">
        <HeroSection />
      </main>
      <LoadingScreen />
    </div>
  );
}
