// Amenities.tsx
interface AmenitiesProps {
    amenities: string[];
  }
  
  const Amenities: React.FC<AmenitiesProps> = ({ amenities }) => {
    return (
      <div className="text-base pt-4">
        <p>Amenities</p>
        <div className="flex flex-wrap">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center justify-center pr-4 pb-2 mr-2 mb-2 bg-blue-100 text-blue-600 rounded-full px-3 py-1">
                <img src={`/amenities/${amenity}.png`} className="w-4 h-4 mr-2" />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
export default Amenities; 