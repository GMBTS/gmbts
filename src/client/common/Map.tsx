import { Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useMemo, useState } from 'react';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};
export default function MyComponent({ location }: { location: GeolocationCoordinates | undefined }) {
  const [lat] = useState(31.7580715);
  const [lng] = useState(35.2119557);
  // Add lat, lng as dependencies
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGhGk3DTCkjF1EUxpMm5ypFoQ-ecrS2gY',
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    [],
  );

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={18}
        center={mapCenter}
        mapContainerStyle={{ width: '100%', height: '500px' }}
      >
        {location && (
          <>
            <Marker
              position={{ lat: location.latitude, lng: location.longitude }}
              animation={google.maps.Animation.DROP}
            />
            <Circle
              center={{ lat: location.latitude, lng: location.longitude }}
              options={{
                fillColor: 'green',
                strokeColor: 'red',
                strokeOpacity: 0.3,
              }}
              radius={location.accuracy || 0}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
