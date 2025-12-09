
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import type { Cow } from '../types';
import { Gender } from '../types';

const CowProfile: React.FC<{ cow: Cow; onClose: () => void }> = ({ cow, onClose }) => {
    const getAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                         <h2 className="text-3xl font-bold text-brand-dark">{cow.name} <span className="text-lg text-gray-500">({cow.tagId})</span></h2>
                         <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                    </div>
                   
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img src={cow.imageUrl} alt={cow.name} className="w-full h-48 object-cover rounded-lg" />
                             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-lg mb-2">Key Info</h3>
                                <p><strong>Breed:</strong> {cow.breed}</p>
                                <p><strong>Age:</strong> {getAge(cow.birthDate)} years</p>
                                <p><strong>Gender:</strong> {cow.gender}</p>
                                <p><strong>Health:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cow.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{cow.healthStatus}</span></p>
                                <p><strong>Expected Yield:</strong> {cow.expectedYield} L/day</p>
                             </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-bold text-lg mb-2">Pregnancy Status</h3>
                                {cow.pregnancy.isPregnant ? (
                                    <>
                                        <p className="text-green-600 font-semibold">Pregnant</p>
                                        <p><strong>Due Date:</strong> {cow.pregnancy.dueDate}</p>
                                        <p><strong>Last Bred:</strong> {cow.pregnancy.lastBredDate}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-600">Not Pregnant</p>
                                )}
                            </div>
                             <div className="p-4 bg-orange-50 rounded-lg">
                                <h3 className="font-bold text-lg mb-2">Vaccination History</h3>
                                {cow.vaccinations.map((v, i) => (
                                    <div key={i} className="text-sm">
                                        <p><strong>{v.name}:</strong> {v.date} (Next: {v.nextDueDate})</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-lg mb-2">Notes</h3>
                                <p className="text-sm">{cow.notes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CowCard: React.FC<{ cow: Cow; onClick: () => void }> = ({ cow, onClick }) => {
    return (
        <div onClick={onClick} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
            <img src={cow.imageUrl} alt={cow.name} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold text-brand-dark">{cow.name}</h3>
                <p className="text-sm text-gray-500">{cow.tagId}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cow.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {cow.healthStatus}
                    </span>
                    <span className="text-gray-600">{cow.breed}</span>
                </div>
            </div>
        </div>
    );
};

const CowList: React.FC = () => {
    const appContext = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState<Gender | 'All'>('All');
    const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

    if (!appContext) return null;
    const { cows } = appContext;
    
    const filteredCows = useMemo(() => {
        return cows
            .filter(cow => {
                if (filterGender === 'All') return true;
                return cow.gender === filterGender;
            })
            .filter(cow => {
                const search = searchTerm.toLowerCase();
                return cow.name.toLowerCase().includes(search) || cow.tagId.toLowerCase().includes(search) || cow.breed.toLowerCase().includes(search);
            });
    }, [cows, searchTerm, filterGender]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-dark">Cow Information</h1>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by name, tag, or breed..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value as Gender | 'All')}
                >
                    <option value="All">All Genders</option>
                    <option value={Gender.Male}>Male</option>
                    <option value={Gender.Female}>Female</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCows.map(cow => (
                    <CowCard key={cow.id} cow={cow} onClick={() => setSelectedCow(cow)} />
                ))}
            </div>
            
            {filteredCows.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p>No cows found matching your criteria.</p>
                </div>
            )}
            
            {selectedCow && <CowProfile cow={selectedCow} onClose={() => setSelectedCow(null)} />}
        </div>
    );
};

export default CowList;
