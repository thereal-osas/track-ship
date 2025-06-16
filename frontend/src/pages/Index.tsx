import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackingForm from "@/components/tracking/TrackingForm";
import { Package, Truck, Clock, Globe, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import backgroundImage from "@/assets/images/delivery.jpg";
import deliveryService from "@/assets/images/delivery-service.jpg";
import ShippingCalculator from "@/components/shipping/ShippingCalculator";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Background Image */}
        <section
          className="bg-cover bg-center py-24 md:py-36 text-white relative"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>

          <div className="dhl-container relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Fast, Reliable Shipping Solutions
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                Track your package or shipment with DHL Express to get real-time
                updates on your delivery status.
              </p>

              <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-3">
                  Track Your Shipment
                </h2>
                <TrackingForm />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16" id="services">
          <div className="dhl-container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Shipping Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-orange-500 transition-transform hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Express Delivery
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Next-day delivery for urgent shipments with time-definite
                    delivery guarantees.
                  </p>
                  <Link to="#">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-orange-500"
                    >
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-orange-300 transition-transform hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    International Shipping
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Reliable worldwide delivery with customs clearance and
                    global tracking capabilities.
                  </p>
                  <Link to="#">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-orange-500"
                    >
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-black transition-transform hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    E-commerce Solutions
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Specialized shipping options for online retailers with
                    integration capabilities.
                  </p>
                  <Link to="#">
                    <Button variant="link" className="p-0 h-auto text-black">
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="dhl-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <AspectRatio
                  ratio={3 / 2}
                  className="overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={deliveryService}
                    alt="Tracking Features"
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  Advanced Tracking Features
                </h2>
                <p className="text-lg text-muted-foreground">
                  Stay informed with our comprehensive tracking system that
                  provides real-time updates and detailed history.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Real-time Updates</h4>
                      <p className="text-muted-foreground">
                        Get instant notifications about your shipment status
                        changes.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-100 p-1 mr-3 mt-1">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Global Coverage</h4>
                      <p className="text-muted-foreground">
                        Track packages across multiple countries and regions.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="rounded-full bg-purple-100 p-1 mr-3 mt-1">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Detailed Delivery Information
                      </h4>
                      <p className="text-muted-foreground">
                        View estimated delivery dates and full shipment history.
                      </p>
                    </div>
                  </li>
                </ul>

                <Link to="/tracking">
                  <Button className="bg-orange-500 hover:bg-orange-600 mt-4">
                    Track a Shipment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Calculator Section */}
        <section className="py-16 bg-white">
          <div className="dhl-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Calculate Shipping Costs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get instant shipping rates for your packages to any destination
                worldwide.
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <ShippingCalculator />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16" id="contact">
          <div className="dhl-container">
            <div className="bg-courier-black-light text-white rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Ship with DHL Express?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Contact our team to learn more about our shipping solutions and
                how we can help your business deliver globally.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  Contact Sales
                </Button>
                <Button className="border-white bg-transparent text-white hover:bg-white/20">
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
