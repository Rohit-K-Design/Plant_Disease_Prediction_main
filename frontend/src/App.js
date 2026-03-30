import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import ImageUpload from './components/ImageUpload';
import MitigationSteps from './components/MitigationSteps';
import ProductSuggestions from './components/ProductSuggestions';
import WeatherWidget from './components/WeatherWidget';
import { Link } from 'react-scroll';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleResetPage = () => {
    window.location.reload();
  };

  const toggleMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg">
        <Container>
          <Navbar.Brand
            style={{
              color: darkMode ? '#a5d6a7' : '#2e7d32',
              textShadow: darkMode ? '0 0 10px #4caf50' : 'none',
              cursor: 'pointer',
            }}
            onClick={handleResetPage}
          >
            Plant Disease Detector 🌿
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="upload" smooth={true} duration={500} style={{ cursor: 'pointer' }}>
              Upload
            </Nav.Link>
            <Nav.Link as={Link} to="mitigation" smooth={true} duration={500} style={{ cursor: 'pointer' }}>
              Mitigation
            </Nav.Link>
            <Nav.Link as={Link} to="productsuggestion" smooth={true} duration={500} style={{ cursor: 'pointer' }}>
              Product Suggestions
            </Nav.Link>
          </Nav>

          <Button variant={darkMode ? 'outline-light' : 'outline-success'} onClick={toggleMode}>
            {darkMode ? '🌓 Light Mode' : '🌓 Dark Mode'}
          </Button>
        </Container>
      </Navbar>

      <Container className="mt-4 mb-5">
        <div id="upload"><ImageUpload /></div>
        <div id="mitigation"><MitigationSteps /></div>
        <div id="productsuggestion"><ProductSuggestions /></div>
      </Container>

      <WeatherWidget />

      <footer style={{
        backgroundColor: darkMode ? '#2c2c2c' : '#f1f8e9',
        color: darkMode ? 'white' : '#1b5e20',
        padding: '20px 0',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <Container>
          <p>© {new Date().getFullYear()} Plant Disease Detector. All rights reserved.</p>
          <p>Developed with 🌱 by <strong>Neha Kumari</strong></p>
          <p>📧 Contact: <a href="mailto:nehakumari4911@gmail.com" style={{ color: darkMode ? '#a5d6a7' : '#2e7d32' }}>nehakumari4911@gmail.com</a></p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
