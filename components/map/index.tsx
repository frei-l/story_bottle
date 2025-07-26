'use client';

import React, { useMemo } from 'react';
import { Map, Source, Layer } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  markerType: 'bubble' | 'star';
  locations: Location[];
  userLocation?: Location;
}

export default function MapComponent({ markerType, locations, userLocation }: MapComponentProps) {
  // Convert locations to GeoJSON format
  const geojsonData = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: locations.map((location, index) => ({
      type: 'Feature' as const,
      properties: { id: index },
      geometry: {
        type: 'Point' as const,
        coordinates: [location.lng, location.lat]
      }
    }))
  }), [locations]);

  // Calculate center point from locations
  const center = useMemo(() => {
    if (locations.length === 0) return { longitude: 0, latitude: 0 };
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { longitude: avgLng, latitude: avgLat };
  }, [locations]);

  // Define cluster layer based on marker type
  const clusterLayer: LayerProps = useMemo(() => ({
    id: 'clusters',
    type: 'symbol',
    source: 'markers',
    filter: ['has', 'point_count'],
    layout: {
      'icon-image': markerType === 'bubble' ? 'bubble-marker' : 'star-marker',
      'icon-size': 0.8,
      'icon-allow-overlap': true
    },
    paint: markerType === 'star' ? {
      'icon-opacity': [
        'interpolate',
        ['linear'],
        ['get', 'point_count'],
        1, 0.3,
        3, 0.6,
        7, 0.9,
        12, 1.0
      ]
    } : {}
  }), [markerType]);

  // Define cluster count layer for bubble type
  const clusterCountLayer: LayerProps = useMemo(() => ({
    id: 'cluster-count',
    type: 'symbol',
    source: 'markers',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 14,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#000000'
    }
  }), []);

  // Define unclustered point layer
  const unclusteredPointLayer: LayerProps = useMemo(() => ({
    id: 'unclustered-point',
    type: 'symbol',
    source: 'markers',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': markerType === 'bubble' ? 'bubble-marker' : 'star-marker',
      'icon-size': 0.8,
      'icon-allow-overlap': true
    },
    paint: markerType === 'star' ? {
      'icon-opacity': 0.3
    } : {}
  }), [markerType]);

  // Define user location layer
  const userLocationLayer: LayerProps = useMemo(() => ({
    id: 'user-location',
    type: 'symbol',
    source: 'user-location',
    layout: {
      'icon-image': 'red-star-marker',
      'icon-size': 0.5,
      'icon-allow-overlap': true
    }
  }), []);

  // Convert user location to GeoJSON format
  const userLocationData = useMemo(() => {
    if (!userLocation) return null;
    
    return {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        properties: { id: 'user' },
        geometry: {
          type: 'Point' as const,
          coordinates: [userLocation.lng, userLocation.lat]
        }
      }]
    };
  }, [userLocation]);

  const handleMapLoad = (event: any) => {
    const map = event.target;
    
    // Load bubble marker image
    const bubbleImg = new Image();
    bubbleImg.onload = () => {
      if (!map.hasImage('bubble-marker')) {
        map.addImage('bubble-marker', bubbleImg);
      }
    };
    bubbleImg.src = '/bubble-marker.png';

    // Load star marker image
    const starImg = new Image();
    starImg.onload = () => {
      if (!map.hasImage('star-marker')) {
        map.addImage('star-marker', starImg);
      }
    };
    starImg.src = '/star-marker-yellow.png';

    // Load red star marker image for user location
    const redStarImg = new Image();
    redStarImg.onload = () => {
      if (!map.hasImage('red-star-marker')) {
        map.addImage('red-star-marker', redStarImg);
      }
    };
    redStarImg.src = '/star-marker-red.png';
  };

  return (
    <div className="w-full h-full">
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom: 10
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onLoad={handleMapLoad}
        interactiveLayerIds={['clusters', 'unclustered-point']}
      >
        <Source
          id="markers"
          type="geojson"
          data={geojsonData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          {markerType === 'bubble' && <Layer {...clusterCountLayer} />}
          <Layer {...unclusteredPointLayer} />
        </Source>
        {userLocationData && (
          <Source
            id="user-location"
            type="geojson"
            data={userLocationData}
          >
            <Layer {...userLocationLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}