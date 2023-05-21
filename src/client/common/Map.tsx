import { Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useMemo } from 'react';

import { CreateComplaintFormData } from '@/types/complaints/create';

const defaultLocation = {
  latitude: 31.7683,
  longitude: 35.2137,
};

export type MapProps = {
  location?: CreateComplaintFormData['location'];
};

export default function Map({ location }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGhGk3DTCkjF1EUxpMm5ypFoQ-ecrS2gY',
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      // scrollwheel: false, // look into this
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
        zoom={location ? 18 : 10}
        center={{
          lat: location?.latitude || defaultLocation.latitude,
          lng: location?.longitude || defaultLocation.longitude,
        }}
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
