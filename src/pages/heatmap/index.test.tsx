import '@testing-library/jest-dom';

import * as googleMapsApi from '@react-google-maps/api';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { prisma } from '@/db/prisma';

import MapWithHeatmap, { getServerSideProps } from './index';

const setupGoogleMock = () => {
  global.window.google = {
    maps: {
      Animation: {
        BOUNCE: 'BOUNCE',
        DROP: 'DROP',
      },
      LatLng: jest.fn(),
    },
  } as any;
};

jest.mock('@react-google-maps/api', () => ({
  __esModule: true,
  Circle: () => <div data-testid="circle" />,
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map" children={children} />,
  // Marker: () => <div data-testid="marker" />,
  HeatmapLayer: () => <div data-testid="heatmap-layer" />,
  useLoadScript: () => ({ isLoaded: true }),
}));

jest.mock('../../db/prisma', () => ({
  __esModule: true, // this makes it work

  prisma: {
    complaint: {
      findMany: jest.fn(),
    },
  },
}));

describe('MapWithHeatmap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it('should render "Loading" when isLoaded is false', () => {
    const result = { isLoaded: false, loadError: undefined, url: '' };
    jest.spyOn(googleMapsApi, 'useLoadScript').mockImplementationOnce(() => result);

    render(<MapWithHeatmap locations={[]} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render GoogleMap and HeatmapLayer when isLoaded is true and locations are provided', () => {
    const mockLocations = [
      { location: '{"latitude": 40.7128, "longitude": -74.0060}' },
      { location: '{"latitude": 41.8781, "longitude": -87.6298}' },
    ];

    render(<MapWithHeatmap locations={mockLocations} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('heatmap-layer')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  it('should fetch locations from the database and return them as props', async () => {
    const mockLocations = [{ location: 'mock-location' }];
    (prisma.complaint.findMany as jest.Mock).mockImplementationOnce(() => mockLocations);

    const { props } = await getServerSideProps();

    expect(prisma.complaint.findMany).toHaveBeenCalledTimes(1);
    expect(props).toEqual({ locations: mockLocations });
  });
});
