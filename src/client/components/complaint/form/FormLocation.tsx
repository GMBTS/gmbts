import { useCallback, useEffect, useState } from 'react';

import Map from '@/client/common/Map';
import { FormGeolocationCoordinates } from '@/types/complaints/create';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const FormLocation: React.FC<{ setLocation: (cord: FormGeolocationCoordinates) => void }> = ({ setLocation }) => {
  const [localLocation, setLocalLocation] = useState<FormGeolocationCoordinates | undefined>(undefined);

  function error(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const updateLocation = useCallback(
    (newLocation: FormGeolocationCoordinates) => {
      setLocation(newLocation);
      setLocalLocation(newLocation);
    },
    [setLocation],
  );

  const onSuccessLocation = useCallback(
    (pos: GeolocationPosition) => {
      updateLocation(pos.coords);

      if (pos.coords.accuracy > 5) {
        navigator?.geolocation.getCurrentPosition(onSuccessLocation, error, options);
      }
    },
    [updateLocation],
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && localLocation === undefined) {
      navigator?.geolocation.getCurrentPosition(onSuccessLocation, error, options);
    }
  }, [localLocation, onSuccessLocation]);

  return (
    <div>
      <Map
        location={localLocation ? { lat: localLocation.latitude, lng: localLocation.longitude } : undefined}
        locationAccuracy={localLocation?.accuracy}
        setLocation={updateLocation}
      />
    </div>
  );
};

export default FormLocation;
