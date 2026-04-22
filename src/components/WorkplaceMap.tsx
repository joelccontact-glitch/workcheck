'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WorkplaceMapProps {
  lat: number;
  lng: number;
  radius: number;
  zones: any[];
  onMapClick: (lat: number, lng: number) => void;
}

// Helper component to center map when lat/lng changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function WorkplaceMap({ lat, lng, radius, zones, onMapClick }: WorkplaceMapProps) {
  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={[lat, lng]} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapEvents onClick={onMapClick} />
      
      {/* Current Marker */}
      <Marker position={[lat, lng]} />
      <Circle 
        center={[lat, lng]} 
        radius={radius} 
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.2 }} 
      />

      {/* Existing Zones */}
      {zones.map(zone => (
        <React.Fragment key={zone.id}>
          <Marker position={[zone.latitude, zone.longitude]} opacity={0.5} />
          <Circle 
            center={[zone.latitude, zone.longitude]} 
            radius={zone.radius} 
            pathOptions={{ color: 'gray', fillColor: 'gray', fillOpacity: 0.1 }} 
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
}
