import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import convert from 'xml-js';

import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';

const Container = styled.div`
  background-color: ${({theme})=>theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({theme})=>theme.boxShadow};
  background-color: ${({theme})=>theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({theme})=>theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({theme})=>theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  svg {
    flex-basis: 30%;
  }
`;

const Temperature = styled.div`
  color: ${({theme})=>theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme})=>theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme})=>theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({theme})=>theme.textColor};
  svg {
    cursor: pointer;
    width: 15px;
    height: auto;
    margin-left: 10px;
  }
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '澳門半島',
    dscription: '雷暴驟雨',
    temperature: 25,
    windSpeed: 1.1,
    rainPossibility: 48.3,
    observationTime: '2024-6-6 10:21:00',
  })

  const [xmlContent, setXmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/weather');
        const xmlData = await response.text();
        setXmlContent(xmlData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/c_actual_brief.xml');
        const xmlData = await response.text();
        setXmlContent(xmlData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  */
  const handleClick = () => {
    fetch('https://xml.smg.gov.mo/c_actual_brief.xml', {      
      method: 'GET',
      "Content-Type": "charset=utf-8"
    })
    .then((response) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, "application/xml");
      const jsonData = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 2 }));
      setJsonContent(jsonData);
      const tempValue = jsonData.ActualWeatherBrief.Custom.Temperature.Value._text;
      setCurrentWeather(currentWeather.temperature, tempValue);
      console.log(tempValue);
    })
    .catch((error) => {
      console.error('Error fetching XML data:', error);
    });
}

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.dscription}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudyIcon />
          </CurrentWeather>
          <AirFlow><AirFlowIcon />{currentWeather.windSpeed}</AirFlow>
          <Rain><RainIcon />{currentWeather.rainPossibility}</Rain>
          <Refresh onClick={handleClick}>最後觀察時間:
            {new Intl.DateTimeFormat('zh-TW',{
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(currentWeather.observationTime))}{''}<RefreshIcon /></Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
