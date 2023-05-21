import '@testing-library/jest-dom';

import * as googleMapsApi from '@react-google-maps/api';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Map from './Map';

const setupGoogleMock = () => {
  global.window.google = {
    maps: {
      Animation: {
        BOUNCE: 'BOUNCE',
        DROP: 'DROP',
      },
    },
  } as any;
};

jest.mock('@react-google-maps/api', () => ({
  __esModule: true,
  Circle: () => <div data-testid="circle" />,
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map" children={children} />,
  Marker: () => <div data-testid="marker" />,
  useLoadScript: () => ({ isLoaded: true }),
}));

describe('Map', () => {
  beforeAll(() => {
    setupGoogleMock();
  });

  it('should render loading state when isLoaded is false', () => {
    const result = { isLoaded: false, loadError: undefined, url: '' };
    jest.spyOn(googleMapsApi, 'useLoadScript').mockImplementationOnce(() => result);

    render(<Map location={undefined} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render GoogleMap component when isLoaded is true and location is undefined', () => {
    render(<Map location={undefined} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('should render GoogleMap component with Marker and Circle when isLoaded is true and location is defined', () => {
    const location = {
      latitude: 40.7128,
      longitude: -74.006,
      accuracy: 100,
    };

    render(<Map location={location} />);

    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
    expect(screen.getByTestId('circle')).toBeInTheDocument();
  });
});
