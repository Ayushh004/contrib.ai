import CtaBlock from "../components/CtaBlock"
import FeatureSection from "../components/FeatureSection"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import HowItWorks from "../components/HowItWorks"
import Navbar from "../components/Navbar"
import StatsBar from "../components/StatsBar"

function LandingPage() {
  return (
    <div>
     <Navbar/>
     <HeroSection/>
     <StatsBar/>
     <FeatureSection/>
     <HowItWorks/>
     <CtaBlock/>
     <Footer/>
    </div>
  )
}

export default LandingPage