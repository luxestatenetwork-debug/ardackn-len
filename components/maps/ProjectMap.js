import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, Autocomplete, useLoadScript } from "@react-google-maps/api";
import mapStyle from "./MapStyle.json";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 40.7128, lng: -74.006 }; // New York as fallback

const ProjectMap = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markerPos, setMarkerPos] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        onLocationSelect({ lat, lng, address });
      }
    });
  }, [onLocationSelect]);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name;
        setMarkerPos({ lat, lng });
        onLocationSelect({ lat, lng, address });
      }
    }
  };

  if (loadError) return <div>Map cannot be loaded</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(auto) => setAutocomplete(auto)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search address..."
          style={{
            boxSizing: `border-box`,
            border: `1px solid #ccc`,
            width: `100%`,
            height: `40px`,
            padding: `0 12px`,
            marginBottom: `12px`,
          }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={markerPos || defaultCenter}
        options={{ styles: mapStyle.styles, disableDefaultUI: true }}
        onClick={onMapClick}
      >
        {markerPos && (
          <Marker
            position={markerPos}
            icon={
              {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#C5A55E",
                fillOpacity: 1,
                scale: 10,
                strokeWeight: 0,
              }
            }
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default ProjectMap;
