import React, { useState } from 'react';
import { MOCK_DELIVERIES } from '../constants';
import { optimizeRouteSequence } from '../services/geminiService';
import { DeliveryRoute } from '../types';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

const DeliveryModule: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryRoute[]>(MOCK_DELIVERIES);
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = async () => {
    setOptimizing(true);
    // Extract addresses for AI context
    const addresses = deliveries.map(d => `${d.clientName}, ${d.address}`);
    const newIndices = await optimizeRouteSequence(addresses);
    
    // Reorder based on indices returned
    const reordered = newIndices.map(i => deliveries[i]).filter(Boolean); // safety check
    setDeliveries(reordered);
    setOptimizing(false);
  };

  const openMap = (lat: number, lng: number) => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-slate-800">Driver Mode</h2>
             <button 
                onClick={handleOptimize}
                disabled={optimizing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center hover:bg-blue-700 transition-colors"
             >
                 {optimizing ? (
                     <span className="animate-spin mr-2">⟳</span>
                 ) : (
                     <Compass className="w-4 h-4 mr-2" />
                 )}
                 Optimize Route
             </button>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-200 z-0"></div>
            
            <div className="relative z-10">
                {deliveries.map((stop, index) => (
                    <div key={stop.id} className="flex items-start p-6 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                        {/* Timeline Connector */}
                        <div className="mr-6 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index === 0 ? 'bg-green-500 text-white' : 'bg-white border-2 border-slate-300 text-slate-500'}`}>
                                {index + 1}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{stop.clientName}</h3>
                                    <p className="text-sm text-slate-500 flex items-center mt-1">
                                        <MapPin className="w-3 h-3 mr-1" /> {stop.address}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                                    stop.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    stop.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                    {stop.status}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-slate-400">Order #{stop.orderId}</p>
                                <button 
                                    onClick={() => openMap(stop.lat, stop.lng)}
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded transition-colors"
                                >
                                    <Navigation className="w-4 h-4 mr-1.5" /> Start Navigation
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-slate-200 rounded-xl h-48 flex items-center justify-center text-slate-400 border border-slate-300 shadow-inner">
            <div className="text-center">
                <Layers className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Interactive Map Integration</p>
                <p className="text-xs opacity-70">(Uses device geolocation in production)</p>
            </div>
        </div>
    </div>
  );
};

export default DeliveryModule;
