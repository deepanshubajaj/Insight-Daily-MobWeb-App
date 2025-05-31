import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import NavBar from './component/Navbar';
import News from './component/News';
import Footer from './component/Footer';
import SplashScreen from './component/SplashScreen/SplashScreen';
import SplashScreenMobile from './component/SplashScreen/SplashScreenMobile';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSplash: true,
      isMobile: window.innerWidth <= 768
    };
  }

  pageSize = 15;
  apiKey = process.env.REACT_APP_API_KEY;

  componentDidMount() {
    console.log('API Key loaded:', this.apiKey ? 'Yes' : 'No');
    if (!this.apiKey) {
      console.error('News API key is not set. Please check your .env file.');
    }
    
    // Check for mobile devices
    window.addEventListener('resize', this.handleResize);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  }
  
  handleSplashComplete = () => {
    this.setState({ showSplash: false });
  }
  
  render() {
    const { showSplash, isMobile } = this.state;
    
    return (
      <div className="d-flex flex-column min-vh-100">
        {showSplash && (
          isMobile ? 
          <SplashScreenMobile onComplete={this.handleSplashComplete} /> : 
          <SplashScreen onComplete={this.handleSplashComplete} />
        )}
        
        <BrowserRouter>
          <NavBar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<News apiKey={this.apiKey} key="general" pageSize={this.pageSize} category="general" />} />
              <Route path="/business" element={<News apiKey={this.apiKey} key="business" pageSize={this.pageSize} category="business" />} />
              <Route path="/entertainment" element={<News apiKey={this.apiKey} key="entertainment" pageSize={this.pageSize} category="entertainment" />} />
              <Route path="/general" element={<News apiKey={this.apiKey} key="general" pageSize={this.pageSize} category="general" />} />
              <Route path="/health" element={<News apiKey={this.apiKey} key="health" pageSize={this.pageSize} category="health" />} />
              <Route path="/science" element={<News apiKey={this.apiKey} key="science" pageSize={this.pageSize} category="science" />} />
              <Route path="/sports" element={<News apiKey={this.apiKey} key="sports" pageSize={this.pageSize} category="sports" />} />
              <Route path="/technology" element={<News apiKey={this.apiKey} key="technology" pageSize={this.pageSize} category="technology" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}
