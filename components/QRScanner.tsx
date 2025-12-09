
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import type { Cow } from '../types';

const CowProfile: React.FC<{ cow: Cow; onClose: () => void }> = ({ cow, onClose }) => {
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-fade-in">
             <div className="flex justify-between items-start">
                 <h2 className="text-2xl font-bold text-brand-dark">{cow.name}</h2>
                 <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold">Close</button>
             </div>
             <p className="text-gray-500 mb-4">{cow.tagId}</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img src={cow.imageUrl} alt={cow.name} className="w-full h-48 object-cover rounded-lg" />
                <div>
                    <p><strong>Breed:</strong> {cow.breed}</p>
                    <p><strong>Gender:</strong> {cow.gender}</p>
                    <p><strong>Health:</strong> {cow.healthStatus}</p>
                    <p><strong>Pregnant:</strong> {cow.pregnancy.isPregnant ? `Yes, due ${cow.pregnancy.dueDate}`: 'No'}</p>
                </div>
             </div>
        </div>
    );
};


const QRScanner: React.FC = () => {
    const appContext = useContext(AppContext);
    const [scannedCow, setScannedCow] = useState<Cow | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    if (!appContext) return null;
    const { cows } = appContext;

    const handleScan = () => {
        setIsScanning(true);
        setScannedCow(null);
        setTimeout(() => {
            const randomCow = cows[Math.floor(Math.random() * cows.length)];
            setScannedCow(randomCow);
            setIsScanning(false);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-3xl font-bold text-brand-dark">QR Code Scanner</h1>
            <p className="text-gray-600">
                Quickly access a cow's information by scanning the QR code on their tag.
                This is a simulation.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full px-6 py-4 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isScanning ? 'Scanning...' : 'Simulate Scan'}
                </button>

                {isScanning && (
                    <div className="mt-6">
                        <div className="animate-pulse text-gray-500">
                            Searching for QR code...
                        </div>
                    </div>
                )}
                
                {scannedCow && (
                    <CowProfile cow={scannedCow} onClose={() => setScannedCow(null)}/>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
