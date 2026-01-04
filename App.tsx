
import React, { useState, useEffect } from 'react';
import { AppView, TestResult } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SpeedReadingTest from './components/SpeedReadingTest';
import PeripheralGridExercise from './components/PeripheralGridExercise';
import FlashWordExercise from './components/FlashWordExercise';
import SchulteTable from './components/SchulteTable';
import RSVPPlayer from './components/RSVPPlayer';
import RSVPWall from './components/RSVPWall';
import ColumnReading from './components/ColumnReading';
import ViewFieldTest from './components/ViewFieldTest';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [results, setResults] = useState<TestResult[]>([]);
  const [age, setAge] = useState<number>(() => {
    const saved = localStorage.getItem('user_age');
    return saved ? parseInt(saved) : 25;
  });

  useEffect(() => {
    localStorage.setItem('user_age', age.toString());
  }, [age]);

  useEffect(() => {
    const saved = localStorage.getItem('speed_reading_results');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse results", e);
      }
    }
  }, []);

  const handleTestComplete = (result: TestResult) => {
    const newResults = [...results, result];
    setResults(newResults);
    localStorage.setItem('speed_reading_results', JSON.stringify(newResults));
  };

  const backToDashboard = () => setCurrentView(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard results={results} onStartTest={() => setCurrentView(AppView.SPEED_TEST)} age={age} setAge={setAge} />;
      case AppView.SPEED_TEST:
        return <SpeedReadingTest onTestComplete={handleTestComplete} age={age} />;
      case AppView.PERIPHERAL_GRID:
        return <PeripheralGridExercise onFinish={backToDashboard} />;
      case AppView.FLASH_WORDS:
        return <FlashWordExercise onFinish={backToDashboard} />;
      case AppView.SCHULTE_TABLE:
        return <SchulteTable onFinish={backToDashboard} />;
      case AppView.RSVP:
        return <RSVPPlayer age={age} />;
      case AppView.RSVP_WALL:
        return <RSVPWall age={age} />;
      case AppView.COLUMN_READING:
        return <ColumnReading age={age} />;
      case AppView.VIEW_FIELD_TEST:
        return <ViewFieldTest />;
      default:
        return <Dashboard results={results} onStartTest={() => setCurrentView(AppView.SPEED_TEST)} age={age} setAge={setAge} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
