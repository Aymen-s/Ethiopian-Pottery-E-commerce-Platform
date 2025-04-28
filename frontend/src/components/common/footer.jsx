import { Link } from "react-router-dom";
import {
  MailIcon,
  MapPinIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  FacebookIcon,
  InstagramIcon,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Traditional Ethiopian Pottery Hub
            </h3>
            <p className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5" />
              Addis Ababa, Ethiopia
            </p>
            <p className="flex items-center gap-2">
              <MailIcon className="w-5 h-5" />
              <a href="mailto:info@ethiopianpotteryhub.com">
                info@ethiopianpotteryhub.com
              </a>
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop/home"
                  className="flex items-center gap-2 hover:underline"
                >
                  <HomeIcon className="w-5 h-5" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/listing"
                  className="flex items-center gap-2 hover:underline"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/account"
                  className="flex items-center gap-2 hover:underline"
                >
                  <UserIcon className="w-5 h-5" />
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <p>Stay connected for updates on new pottery collections!</p>
            <div className="flex gap-4 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <FacebookIcon className="w-5 h-5" />
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <InstagramIcon className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>© 2025 Traditional Ethiopian Pottery Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
