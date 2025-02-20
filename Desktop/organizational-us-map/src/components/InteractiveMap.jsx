import React, { useState, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { geoAlbersUsa } from 'd3-geo';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const locationData = [
  { name: "Alabama", representative: "X", people: 6, amount: 13600, coordinates: [-86.7911, 32.8067] },
  { name: "Albany", representative: "X", people: 1, amount: 600, coordinates: [-73.7562, 42.6526] },
  { name: "Arizona", representative: "X", people: 1, amount: 12000, coordinates: [-111.0937, 34.0489] },
  { name: "Atlanta", representative: "X", people: 1, amount: 12000, coordinates: [-84.3880, 33.7490] },
  { name: "Boston", representative: "X", people: 11, amount: 119600, coordinates: [-71.0589, 42.3601] },
  { name: "California", representative: "X", people: 2, amount: 18000, coordinates: [-119.4179, 36.7783] },
  { name: "Chicago", representative: "X", people: 5, amount: 33200, coordinates: [-87.6298, 41.8781] },
  { name: "Connecticut", representative: "X", people: 7, amount: 42200, coordinates: [-72.7273, 41.6032] },
  { name: "Dallas", representative: "X", people: 9, amount: 98800, coordinates: [-96.7970, 32.7767] },
  { name: "Florida", representative: "X", people: 3, amount: 7499, coordinates: [-81.5158, 27.6648] },
  { name: "Houston", representative: "X", people: 6, amount: 24800, coordinates: [-95.3698, 29.7604] },
  { name: "Indiana", representative: "X", people: 1, amount: 12000, coordinates: [-86.1349, 39.7684] },
  { name: "Kentucky", representative: "X", people: 1, amount: 6000, coordinates: [-84.2700, 37.8393] },
  { name: "Louisiana", representative: "X", people: 1, amount: 18000, coordinates: [-91.9623, 30.9843] },
  { name: "Maine", representative: "X", people: 2, amount: 36000, coordinates: [-69.4455, 45.2538] },
  { name: "Maryland", representative: "X", people: 10, amount: 81100, coordinates: [-76.6413, 39.0458] },
  { name: "Michigan", representative: "X", people: 1, amount: 480, coordinates: [-84.5603, 43.3266] },
  { name: "Nebraska", representative: "X", people: 2, amount: 16500, coordinates: [-99.9018, 41.4925] },
  { name: "New Jersey", representative: "X", people: 9, amount: 69650, coordinates: [-74.4057, 40.0583] },
  { name: "New York", representative: "X", people: 10, amount: 30860, coordinates: [-74.2179, 43.2994] },
  { name: "New Mexico", representative: "X", people: 1, amount: 600, coordinates: [-106.2371, 34.5199] },
  { name: "North Carolina", representative: "X", people: 2, amount: 14400, coordinates: [-79.0193, 35.7596] },
  { name: "Ohio", representative: "X", people: 3, amount: 25800, coordinates: [-82.9071, 40.4173] },
  { name: "Oklahoma", representative: "X", people: 2, amount: 24000, coordinates: [-97.5164, 35.4676] },
  { name: "Philadelphia", representative: "X", people: 3, amount: 14000, coordinates: [-75.1652, 39.9526] },
  { name: "Pittsburgh", representative: "X", people: 4, amount: 35400, coordinates: [-79.9959, 40.4406] },
  { name: "San Francisco", representative: "X", people: 2, amount: 5500, coordinates: [-122.4194, 37.7749] },
  { name: "St Louis", representative: "X", people: 5, amount: 22500, coordinates: [-90.1994, 38.6270] },
  { name: "Tennessee", representative: "X", people: 1, amount: 3000, coordinates: [-86.7844, 35.8173] },
  { name: "Virginia", representative: "X", people: 1, amount: 6000, coordinates: [-78.6569, 37.4316] }
];

// Define regions and their colors
const getRegionColor = (geo) => {
  const regions = {
    west: ['WA', 'OR', 'CA', 'NV', 'ID', 'MT', 'WY', 'UT', 'CO', 'AZ', 'NM'],
    midwest: ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'IN', 'MI', 'OH'],
    south: ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'GA', 'FL', 'SC', 'NC'],
    northeast: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'PA', 'NJ', 'DE', 'MD', 'VA', 'WV'],
    other: ['AK', 'HI']
  };

  const colors = {
    west: "#1B4965",     // Steel blue
    midwest: "#E8985E",  // Warm orange
    south: "#FF6B6B",    // Coral red
    northeast: "#96E6B3", // Mint green
    other: "#B8B8D1",    // Lavender
    default: "#1a1a2e"   // Dark blue (background color)
  };

  const stateId = geo.properties.postal;
  
  if (regions.west.includes(stateId)) return colors.west;
  if (regions.midwest.includes(stateId)) return colors.midwest;
  if (regions.south.includes(stateId)) return colors.south;
  if (regions.northeast.includes(stateId)) return colors.northeast;
  if (regions.other.includes(stateId)) return colors.other;
  return colors.default;
};

const Tooltip = styled.div`
  position: absolute;
  background: rgba(22, 33, 62, 0.98);
  border: 1px solid #00b4d8;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 16px rgba(0, 180, 216, 0.3);
  pointer-events: none;
  z-index: 1000;
  color: white;
  font-family: 'Inter', Arial, sans-serif;
  backdrop-filter: blur(8px);
  min-width: 200px;
  transform: translateX(20px);

  > div {
    margin: 4px 0;
    
    &:first-child {
      font-weight: 600;
      color: #90e0ef;
      font-size: 1.2em;
      border-bottom: 1px solid rgba(144, 224, 239, 0.3);
      padding-bottom: 5px;
      margin-bottom: 10px;
    }

    &:not(:first-child) {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
  }
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  background: #1a2333;

  @media (max-width: 768px) {
    height: 60vh;
  }
`;

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(22, 33, 62, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 180, 216, 0.2);
  border: 1px solid #00b4d8;
  backdrop-filter: blur(4px);
  color: white;

  h4 {
    margin: 0 0 10px 0;
    color: #90e0ef;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    padding: 10px;
  }
`;

function InteractiveMap() {
  const [tooltipContent, setTooltipContent] = useState(null);
  const mapRef = useRef(null);

  const maxAmount = Math.max(...locationData.map(d => d.amount));
  const sizeScale = scaleLinear()
    .domain([0, maxAmount])
    .range([5, 20]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to convert geo coordinates to screen coordinates
  const getScreenPosition = (coordinates) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    
    const projection = geoAlbersUsa()
      .scale(1000)
      .translate([mapRef.current.clientWidth / 2, mapRef.current.clientHeight / 2]);
    
    const [x, y] = projection(coordinates);
    return { x, y };
  };

  return (
    <MapContainer ref={mapRef}>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1a2333"
                  stroke="#2d4164"
                  strokeWidth={0.5}
                  style={{
                    default: { 
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    },
                    hover: { 
                      fill: "#2d4164",
                      strokeWidth: 0.5,
                      outline: 'none'
                    },
                    pressed: { 
                      outline: 'none' 
                    },
                  }}
                />
              ))
            }
          </Geographies>
          
          {locationData.map(({ name, coordinates, amount, representative, people }) => {
            const position = getScreenPosition(coordinates);
            return (
              <Marker
                key={name}
                coordinates={coordinates}
                onMouseEnter={() => {
                  setTooltipContent({
                    name,
                    details: [
                      { label: "Representative", value: representative },
                      { label: "People", value: people },
                      { label: "Amount", value: formatAmount(amount) }
                    ],
                    position
                  });
                }}
                onMouseLeave={() => {
                  setTooltipContent(null);
                }}
              >
                <circle
                  r={sizeScale(amount)}
                  fill="#3CC7FF"
                  stroke="#3CC7FF"
                  strokeWidth={1}
                  opacity={0.85}
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 6px rgba(60, 199, 255, 0.5))',
                  }}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <Tooltip
          style={{
            left: tooltipContent.position.x,
            top: tooltipContent.position.y,
            background: 'rgba(26, 35, 51, 0.95)',
            boxShadow: '0 4px 16px rgba(60, 199, 255, 0.2)'
          }}
        >
          <div>{tooltipContent.name}</div>
          {tooltipContent.details.map((detail, i) => (
            <div key={i}>
              <span style={{ color: '#3CC7FF' }}>{detail.label}:</span>
              <span>{detail.value}</span>
            </div>
          ))}
        </Tooltip>
      )}

      <Legend>
        <h4>Fundraising Amount</h4>
        <div>
          <svg width="150" height="50">
            <circle cx="25" cy="25" r="5" fill="#3CC7FF" stroke="#3CC7FF" strokeWidth={1} opacity={0.85} />
            <circle cx="75" cy="25" r="10" fill="#3CC7FF" stroke="#3CC7FF" strokeWidth={1} opacity={0.85} />
            <circle cx="125" cy="25" r="15" fill="#3CC7FF" stroke="#3CC7FF" strokeWidth={1} opacity={0.85} />
            <text x="25" y="45" textAnchor="middle" fontSize="10" fill="white">$1K</text>
            <text x="75" y="45" textAnchor="middle" fontSize="10" fill="white">$50K</text>
            <text x="125" y="45" textAnchor="middle" fontSize="10" fill="white">$100K+</text>
          </svg>
        </div>
      </Legend>
    </MapContainer>
  );
}

export default InteractiveMap; 