import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Clock } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import VehicleCard from '../components/VehicleCard';

const features = [
  {
    icon: Star,
    title: 'Premium Vehicles',
    description: 'Choose from our selection of luxury and comfortable vehicles',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Safe and secure booking process with instant confirmation',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for your peace of mind',
  },
];

export default function Home() {
  const { vehicles, loading, fetchVehicles } = useVehicleStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="bg-white">
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
            alt="Luxury car"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium Car Rental Experience
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Experience luxury and comfort with our premium fleet of vehicles.
            Book your perfect ride today and enjoy the journey.
          </p>
          <div className="mt-10">
            <Link
              to="/vehicles"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center">
                <feature.icon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
          <Link
            to="/vehicles"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Vehicles →
          </Link>
        </div>

        {loading ? (
          <div className="text-center">Loading vehicles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 3).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}