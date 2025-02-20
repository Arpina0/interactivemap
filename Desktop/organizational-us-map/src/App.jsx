import React from 'react';
import styled from 'styled-components';
import InteractiveMap from './components/InteractiveMap';
import logo from './assets/logo.png';

const AppContainer = styled.div`
  text-align: center;
  background-color: #1a1a2e;
  min-height: 100vh;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  height: 80px;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(0, 180, 216, 0.3));

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  margin: 10px 0;
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(120deg, #00b4d8, #90e0ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  color: #90e0ef;
  font-size: 1.2rem;
  margin: 10px 0;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  opacity: 0.9;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 180, 216, 0.1);
  background: #16213e;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00b4d8, transparent);
  }
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Logo src={logo} alt="White Tulip Health Foundation Logo" />
        <Title>Whitetulip  Health Foundation</Title>
        <Subtitle>2025 Fundraising Map</Subtitle>
      </Header>
      <MapContainer>
        <InteractiveMap />
      </MapContainer>
    </AppContainer>
  );
}

export default App;
