import { Box, Button, Typography } from '@mui/material';
import { GoogleMap, HeatmapLayer, useLoadScript } from '@react-google-maps/api';
import { wrapGetServerSidePropsWithSentry } from '@sentry/nextjs';
import Head from 'next/head';
import React, { useMemo } from 'react';

import { prisma } from '@/db/prisma';

const defaultLocation: google.maps.LatLngLiteral = {
  lat: 31.7683,
  lng: 35.2137,
};

const MapWithHeatmap: React.FC<{ locations: { location: string }[] }> = ({ locations }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGhGk3DTCkjF1EUxpMm5ypFoQ-ecrS2gY',
    libraries: ['places', 'visualization'],
  });

  const parseLocations = useMemo(() => {
    if (!isLoaded) {
      return [];
    }

    return locations.map(({ location: rawLocation }) => {
      const locations = JSON.parse(rawLocation) as { latitude: number; longitude: number };

      return new google.maps.LatLng(locations.latitude, locations.longitude);
    });
  }, [locations, isLoaded]);

  if (!isLoaded) {
    return <div>Loading</div>;
  }

  const throwError = () => {
    throw new Error('test');
  };

  return (
    <GoogleMap
      mapContainerStyle={{ maxHeight: 1000, maxWidth: 1000, width: '90%', height: '90%' }}
      center={defaultLocation}
      zoom={13}
    >
      <Button onClick={throwError}>Throw Error</Button>

      <HeatmapLayer data={parseLocations} />
    </GoogleMap>
  );
};

const HeatMap: React.FC<{ locations: { location: string }[] }> = ({ locations }) => {
  return (
    <>
      <Head>
        <title>GMBTS | HeatMap</title>
        <meta name="description" content="HeatMap parking violation heatmap" />
        <meta property="og:title" content="GMBTS | HeatMap" />
        <meta property="og:description" content="HeatMap parking violation heatmap" />
        <meta property="og:image" content="https://gmbts.com/icon-256x256.png" />
        <meta property="og:url" content="https://gmbts.com/heatmap" />
        <meta property="og:type" content="article" />

        <meta property="twitter:image" content="https://gmbts.com/icon-512x512.png" />
        <meta property="twitter:title" content="GMBTS | HeatMap" />
        <meta property="twitter:description" content="HeatMap parking violation heatmap" />
      </Head>
      <div style={{ height: 'calc(100vh - 48px)' }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          HeatMap
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1, height: '100%' }}>
          <MapWithHeatmap locations={locations} />
        </Box>
      </div>
    </>
  );
};

export default HeatMap;

const getProps = async () => {
  const locations = await prisma.complaint.findMany({ select: { location: true }, where: { location: { not: null } } });

  return {
    props: {
      locations,
    },
  };
};

export const getServerSideProps = wrapGetServerSidePropsWithSentry(getProps, '/heatmap');
