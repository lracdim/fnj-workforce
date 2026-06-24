import Hero from '../components/sections/Hero';
import TrustStrip from '../components/sections/TrustStrip';
import WhoWeAre from '../components/sections/WhoWeAre';
import VideoFeature from '../components/sections/VideoFeature';
import CoreValues from '../components/sections/CoreValues';
import IndustriesPreview from '../components/sections/IndustriesPreview';
import Process from '../components/sections/Process';
import Testimonials from '../components/sections/Testimonials';
import BlogPreview from '../components/sections/BlogPreview';
import FAQ from '../components/sections/FAQ';
import FooterCTA from '../components/sections/FooterCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhoWeAre />
      <VideoFeature />
      <CoreValues />
      <IndustriesPreview />
      <Process />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <FooterCTA />
    </>
  );
}

