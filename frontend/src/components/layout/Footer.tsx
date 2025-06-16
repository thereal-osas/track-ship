import React from "react";
import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-courier-black-light text-white pt-12 pb-6">
      <div className="dhl-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-orange-500 mr-2" />
              <span className="text-xl font-bold">
                <span className="text-orange-500">Express</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Fast, reliable delivery services across the globe.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                <a
                  href="mailto:info@dhlexpress.com"
                  className="text-gray-400 hover:text-white"
                >
                  info@dhlexpress.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                <a
                  href="tel:+18001234567"
                  className="text-gray-400 hover:text-white"
                >
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                <span className="text-gray-400">
                  Global Headquarters, Main Street
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-400 hover:text-white">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="#about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  International Shipping
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Business Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">
                  Shipping Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} DHL Express. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
