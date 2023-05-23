import { Autocomplete, Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useMemo, useRef } from 'react';

import { FormGeolocationCoordinates } from '@/types/complaints/create';
const defaultLocation: google.maps.LatLngLiteral = {
  lat: 31.7683,
  lng: 35.2137,
};

export type MapProps = {
  location?: google.maps.LatLngLiteral;
  locationAccuracy?: number;
  setLocation: (cords: FormGeolocationCoordinates) => void;
};

export default function Map({ location, locationAccuracy, setLocation }: MapProps) {
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const [searchedPlace, setSearchedPlace] = React.useState<google.maps.places.PlaceResult | undefined>(undefined);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGhGk3DTCkjF1EUxpMm5ypFoQ-ecrS2gY',
    libraries: ['places', 'visualization'],
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    [],
  );

  const onPlacesChanged = () => {
    const places = autocomplete.current?.getPlace();
    setSearchedPlace(places);

    if (!places?.geometry?.location) return;
    setLocation({
      latitude: places?.geometry?.location.lat() ?? 0,
      longitude: places?.geometry?.location.lng() ?? 0,
      accuracy: 0,
    });
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const usedLocation = searchedPlace?.geometry?.location ?? location;

  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={usedLocation ? 18 : 10}
        center={usedLocation ?? defaultLocation}
        mapContainerStyle={{ width: '80%', height: '300px', margin: 'auto', maxWidth: 600 }}
      >
        <Autocomplete onLoad={(ref) => (autocomplete.current = ref)} onPlaceChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="חפש"
            style={{
              textAlign: 'right',
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
            }}
          />
        </Autocomplete>
        {location && !searchedPlace?.geometry?.location && (
          <>
            <Marker position={location} animation={google.maps.Animation.DROP} />
            <Circle
              center={location}
              options={{
                fillColor: 'green',
                strokeColor: 'red',
                strokeOpacity: 0.3,
              }}
              radius={locationAccuracy ?? 2}
            />
          </>
        )}

        {searchedPlace?.geometry?.location && <Marker position={searchedPlace.geometry.location} />}
      </GoogleMap>
    </div>
  );
}
