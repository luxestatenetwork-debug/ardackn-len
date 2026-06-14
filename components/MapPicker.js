// components/MapPicker.js
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = { lat: 41.015137, lng: 28.979530 }; // Istanbul default

export default function MapPicker({ onSelect }) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    // reverse geocode to get address (simplified – just send lat,lng)
    const addr = `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
    onSelect && onSelect(addr);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;
    const place = places[0];
    if (!place.geometry) return;
    const loc = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setMapCenter(loc);
    setMarkerPos(loc);
    const address = place.formatted_address || place.name;
    onSelect && onSelect(address);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <StandaloneSearchBox
        onLoad={(ref) => setSearchBox(ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Adres arayın…"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0,0,0,0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: `absolute`,
            left: `50%`,
            marginLeft: `-120px`,
            top: `10px`,
          }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {markerPos && <Marker position={markerPos} />}
      </GoogleMap>
    </LoadScript>
  );
}
