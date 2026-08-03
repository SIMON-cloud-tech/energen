
import SEO from '../components/SEO/Seo.jsx';
import Hero from '../components/landingpage/jsx/Hero.jsx';
import Process from '../components/landingpage/jsx/Process.jsx';
import Story from '../components/landingpage/jsx/Story.jsx';
import FeaturedProducts from '../components/landingpage/jsx/FeaturedProducts.jsx';
import Reach from '../components/landingpage/jsx/Reach.jsx';
import ProjectsSection from '../components/landingpage/jsx/ProjectsSection.jsx';
import LatestBlogs from '../components/landingpage/jsx/LatestBlogs.jsx';
import Testimonials from '../components/landingpage/jsx/Testimonials.jsx';


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