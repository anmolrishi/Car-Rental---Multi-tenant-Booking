import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Calendar, DollarSign, Check, X } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicle } = useVehicleStore();
  const { createBooking } = useBookingStore();
  const { user } = useAuthStore();
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const loadVehicle = async () => {
      if (id) {
        const data = await getVehicle(id);
        if (data) {
          setVehicle(data);
        } else {
          navigate('/');
        }
      }
    };
    loadVehicle();
  }, [id, getVehicle, navigate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * vehicle.price_per_day;

    try {
      await createBooking({
        user_id: user.id,
        vehicle_id: vehicle.id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: 'pending',
      });
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  if (!vehicle) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={vehicle.image_url}
            alt={`${vehicle.name} ${vehicle.model}`}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.name} {vehicle.model}
            </h1>
            <p className="mt-2 text-gray-500">Year: {vehicle.year}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="ml-1 font-semibold">
                ${vehicle.price_per_day}/day
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="ml-1">
                {vehicle.available ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" /> Available
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <X className="h-5 w-5 mr-1" /> Not Available
                  </span>
                )}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{vehicle.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Features</h2>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {vehicle.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center text-gray-600"
                >
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {vehicle.available && (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}