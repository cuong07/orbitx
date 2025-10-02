import HeroUI from "@/components/ui/heroui";
import { useTheme } from 'next-themes';
import { Lamphome } from "../ui/lamphome";
import { Button } from "../ui/button";
import { Link } from "react-router";
import StylishDock from "@/components/ui/magicdock";
import { Home as HomeIcon, Settings as SettingsIcon } from "lucide-react";
import { AnimatedButton } from "../ui/animated-button";
import Globe from "../ui/globe";


const dockItems = [
  {
    id: 1,
    icon: <HomeIcon size={24} />,
    label: "Home",
    description: "Return to homepage",
    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
  {
    id: 2,
    icon: <SettingsIcon size={24} />,
    label: "Settings",
    description: "Trading preferences",
    onClick: () => console.log("Settings clicked"),
  },
];


const MainLayout = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground">
      {/* <Globe
        rotateCities={["new york", "london", "tokyo", "dubai"]}
        rotationSpeed={3000}
        markers={[
          { location: [40.7128, -74.006], size: 0.1 },
          { location: [51.5074, -0.1278], size: 0.1 },
          { location: [35.6762, 139.6503], size: 0.1 },
          { location: [25.2048, 55.2708], size: 0.1 }
        ]}
        glowColor={[0.1, 0.8, 1]}
        markerColor={[0.1, 0.8, 1]}
        className="w-[800px]"
      /> */}
      <Lamphome
        title={<div className="text-7xl">OrbitX</div>}
        description="Professional cryptocurrency trading platform with real-time market data, advanced charting tools, and seamless trading experience for both beginners and experts."
        logoSrc="/favicon.ico"
        logoAlt="My Logo"
        navItems={[
          { href: "/", label: "Home" },
          { href: "/trade", label: "Trade" },
          { href: "/markets", label: "Markets" },
          { href: "/portfolio", label: "Portfolio" },
        ]}
        className="my-custom-class"
      >
        <div className="mt-12">
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link className="w-full md:w-auto" to="/trade">
              <AnimatedButton
                className="bg-green-500 text-white text-xl px-8 py-6 hover:bg-green-600"
                variant="default"
                size="default"
                glow={true}
                textEffect="normal"
                uppercase={true}
                rounded="custom"
                asChild={false}
                hideAnimations={false}
                shimmerColor="#39FF14"
                shimmerSize="0.15em"
                shimmerDuration="3s"
                borderRadius="100px"
                background="rgba(0, 0, 0, 1)"
              >
                Start Trading
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </Lamphome>
      {/* <StylishDock
        items={dockItems}
        distance={150}
        panelHeight={64}
        baseItemSize={50}
        magnification={70}
        variant="default"
      /> */}
      {/* <Globe
        rotateCities={["new york", "london", "tokyo", "dubai"]}
        rotationSpeed={3000}
        markers={[
          { location: [40.7128, -74.006], size: 0.1 },
          { location: [51.5074, -0.1278], size: 0.1 },
          { location: [35.6762, 139.6503], size: 0.1 },
          { location: [25.2048, 55.2708], size: 0.1 }
        ]}
        glowColor={[0.1, 0.8, 1]}
        markerColor={[0.1, 0.8, 1]}
        className="max-w-[800px]"
      /> */}
      {/* <GlobeCities /> */}
    </div>

  )
}

export default MainLayout



export function HerouiDemo() {
  return (
    <HeroUI
      title="ScrollX UI"
      subtitle="Where Interactions Spark Joy"
      badgeText="✨ Now Open Source"
      primaryCTA="Get Started"
      secondaryCTA="Documentation"
      features={[
        "TypeScript First",
        "Dark Mode",
        "100% Customizable",
        "MIT Licensed",
      ]}
      globeBaseColor={{
        light: [0.98, 0.98, 0.98],
        dark: [0.12, 0.12, 0.12],
      }}
      globeMarkerColor={{
        light: [0.2, 0.5, 0.9],
        dark: [0.1, 0.8, 1],
      }}
      globeGlowColor={{
        light: [0.3, 0.3, 0.3],
        dark: [1, 1, 1],
      }}
    />
  );
}



function GlobeCities() {
  return (
    <Globe
      // rotateCities={["new york", "london", "tokyo", "dubai", "paris"]}
      // rotationSpeed={8000}
      markers={[
        { location: [10.8231, 106.6297], size: 0.1 },
        //   { location: [51.5074, -0.1278], size: 0.1 },
        //   { location: [35.6762, 139.6503], size: 0.1 },
        //   { location: [25.2048, 55.2708], size: 0.1 },
        //   { location: [48.8566, 2.3522], size: 0.1 },
      ]}
      // glowColor={[0.1, 0.8, 1]}
      // markerColor={[0.1, 0.8, 1]}
      scale={1}
    // autoRotate={false}
    />
  );
}