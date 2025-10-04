import { Link } from "react-router";
import { AnimatedButton } from "../ui/animated-button";
import { Lamphome } from "../ui/lamphome";
import { Particles } from "../ui/particles";


const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground overflow-hidden">
      {/* Animated Background Particles */}
      <Particles
        color="#00ff88"
        particleCount={100}
        particleSize={2}
        animate={true}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 z-10"></div>

      <div className="relative z-20">
        <Lamphome
          title={
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              OrbitX
            </div>
          }
          description="Professional cryptocurrency trading platform with real-time market data, advanced charting tools, and seamless trading experience for both beginners and experts."
          logoSrc="/favicon.ico"
          logoAlt="OrbitX Logo"
          navItems={[
            { href: "/", label: "Home" },
            { href: "/trade", label: "Trade" },
            { href: "/markets", label: "Markets" },
            { href: "/portfolio", label: "Portfolio" },
          ]}
          className="my-custom-class"
        >
          <div className="mt-16 space-y-8">
            {/* Feature Cards */}


            {/* CTA Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link to="/trade" className="w-full sm:w-auto">
                  <AnimatedButton
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-12 py-6 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                    variant="default"
                    size="default"
                    glow={true}
                    textEffect="normal"
                    uppercase={true}
                    rounded="custom"
                    asChild={false}
                    hideAnimations={false}
                    shimmerColor="#00ff88"
                    shimmerSize="0.15em"
                    shimmerDuration="3s"
                    borderRadius="100px"
                    background="linear-gradient(135deg, #10b981, #059669)"
                  >
                    Start Trading Now
                  </AnimatedButton>
                </Link>

              </div>
            </div>

          </div>
        </Lamphome>
      </div>

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


