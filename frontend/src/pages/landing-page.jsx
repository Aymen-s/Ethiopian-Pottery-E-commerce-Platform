import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import landingPage from "../assets/landing-page.png";
import artisan from "../assets/artisan.png";
import {
  BrushIcon,
  CoffeeIcon,
  EthernetPort,
  GlassWaterIcon,
  IceCreamBowlIcon,
  SoupIcon,
  UsersIcon,
} from "lucide-react";

const categoriesWithIcon = [
  { id: "jebenas", label: "Jebenas", icon: CoffeeIcon },
  { id: "dists", label: "Dists", icon: SoupIcon },
  { id: "bowls", label: "Bowls", icon: IceCreamBowlIcon },
  { id: "vases", label: "Vases", icon: GlassWaterIcon },
  { id: "other", label: "Other", icon: EthernetPort },
];

function LandingPage() {
  const navigate = useNavigate();

  function handleNavigateToListingPage(categoryId) {
    const queryParams = new URLSearchParams({ category: categoryId });
    navigate({
      pathname: "/shop/listing",
      search: queryParams.toString(),
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6f2]">
      {/* Navigation Bar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 fixed z-50">
        <div className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-amber-700">
              E-Commerce
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/auth/login")}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate("/auth/register")}
              className="bg-amber-600 hover:bg-amber-700 cursor-pointer"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative w-full h-screen max-h-[800px] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${landingPage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center pt-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                <span className="text-amber-200">Ethiopian</span> Pottery
                Artistry
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8">
                Discover handcrafted treasures that carry centuries of
                tradition, each piece telling a story of Ethiopian heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/shop/home")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 rounded-lg transition-all hover:scale-105 cursor-pointer"
                >
                  Explore Collection
                </Button>
                <Button
                  onClick={() =>
                    document
                      .getElementById("about")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  variant="outline"
                  className="text-black border-white hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-lg transition-all hover:scale-105 cursor-pointer"
                >
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#faf6f2] to-transparent"></div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold">OUR COLLECTION</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Traditional Craftsmanship
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 mt-4">
              Each category represents a unique aspect of Ethiopian pottery
              tradition, meticulously crafted by skilled artisans.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(categoryItem.id)}
                key={categoryItem.id}
                className="cursor-pointer group bg-white hover:bg-amber-50 border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="bg-amber-100/30 group-hover:bg-amber-100/50 p-4 rounded-full mb-4 transition-colors">
                    <categoryItem.icon className="w-10 h-10 text-amber-600" />
                  </div>
                  <span className="font-semibold text-lg text-gray-800 group-hover:text-amber-700 transition-colors">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <img
                src={artisan}
                alt="Ethiopian artisans at work"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-600 p-6 rounded-xl shadow-lg hidden md:block">
                <UsersIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-amber-600 font-semibold">OUR MISSION</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Preserving Heritage Through Art
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We bridge the gap between traditional Ethiopian artisans and the
                modern world. Each piece in our collection is more than pottery
                - it's a vessel carrying generations of knowledge, culture, and
                artistic expression from the highlands of Ethiopia.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                By supporting our platform, you're directly contributing to the
                preservation of these ancient crafts and empowering local
                communities to sustain their livelihoods through their art.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate("/shop/home")}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-lg"
                >
                  Meet Our Artisans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Voices From Our Community
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="bg-white border-0 shadow-sm rounded-xl overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Labore soluta blanditiis, aut placeat adipisci possimus
                    expedita quae veniam tempore error!"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mr X.</h4>
                      <p className="text-sm text-gray-500">Addis Ababa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative py-28 bg-gradient-to-r from-amber-700 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Cultural Journey
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Create an account to receive exclusive access to new collections,
              artisan stories, and special promotions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-white text-amber-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold cursor-pointer"
              >
                Sign Up Free
              </Button>
              <Button
                onClick={() => navigate("/auth/login")}
                variant="outline"
                className="text-black border-white hover:bg-white/10 text-lg px-8 py-6 rounded-lg font-semibold cursor-pointer"
              >
                Already a Member?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Ethiopian Pottery Hub</h3>
              <p className="text-gray-400">
                Preserving tradition through authentic Ethiopian pottery
                craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                {categoriesWithIcon.map((category) => (
                  <li key={category.id}>
                    <a
                      href="#"
                      onClick={() => handleNavigateToListingPage(category.id)}
                      className="text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {category.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Our Artisans
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Sustainability
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748 1.857.344.353.3.882.344 1.857.047 1.023.058 1.351.058 3.807v.468c0 2.456-.011 2.784-.058 3.807-.045.975-.207 1.504-.344 1.857-.182.467-.4.8-.748 1.15-.35.35-.683.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058h-.08c-2.597 0-2.917-.01-3.96-.058-.975-.045-1.505-.207-1.858-.344-.467-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.054-.058-1.37-.058-4.041v-.08c0-2.597.01-2.917.058-3.96.045-.975.207-1.505.344-1.858.182-.467.399-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.054-.048 1.37-.058 4.041-.058h.08z" />
                    <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
              <div className="mt-6">
                <p className="text-gray-400">Subscribe to our newsletter</p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-400 w-full"
                  />
                  <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Ethiopian Pottery Hub. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
