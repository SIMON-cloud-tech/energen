
import SEO from '../components/SEO/Seo';
import Hero from '../components/landingpage/jsx/Hero';
import Process from '../components/landingpage/jsx/Process';
import Story from '../components/landingpage/jsx/Story';
import FeaturedProducts from '../components/landingpage/jsx/FeaturedProducts';
import Reach from '../components/landingpage/jsx/Reach';
import ProjectsSection from '../components/landingpage/jsx/ProjectsSection';
import LatestBlogs from '../components/landingpage/jsx/LatestBlogs';
import Testimonials from '../components/landingpage/jsx/Testimonials';


function Home(){
  return(
    <>
      <SEO
        title="Solar Energy Experts in Kenya"
        description="Energen delivers custom solar installations, battery systems, and energy savings for homes and businesses across Kenya."
        keywords="solar energy Kenya, solar panels, solar installation, renewable energy, battery backup"
      />
      <Hero />
      <Story />
      <Process />
      <FeaturedProducts />
      <Reach />
      <ProjectsSection />
      <Testimonials />
      <LatestBlogs />
    </>
  )
}
export default Home;