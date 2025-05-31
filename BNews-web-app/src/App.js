import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'; 
import NavBar from './component/Navbar';
import News from './component/News';
import Footer from './component/Footer';
import SplashScreen from './component/SplashScreen/SplashScreen';
import SplashScreenMobile from './component/SplashScreen/SplashScreenMobile';

function withRouter(Component) {
  return props => {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSplash: true,
      isMobile: window.innerWidth <= 768,
      articles: [],
      totalResults: 0,
      loading: false,
      error: null,
      category: 'general',
    };
  }

  pageSize = 15;
  apiKey = process.env.REACT_APP_API_KEY;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.fetchNews(this.state.category);
  }

  componentDidUpdate(prevProps, prevState) {
    const newCategory = this.getCategoryFromPath(this.props.location?.pathname);
    if (newCategory && newCategory !== this.state.category) {
      this.setState({ category: newCategory }, () => {
        this.fetchNews(newCategory);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  handleSplashComplete = () => {
    this.setState({ showSplash: false });
  };

  getCategoryFromPath = (pathname) => {
    const path = pathname?.replace('/', '') || 'general';
    return path === '' ? 'general' : path;
  };

  fetchNews = async (category) => {
    this.setState({ loading: true, error: null });

    try {
      const baseNewsUrl = `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&page=1&pageSize=${this.pageSize}&apiKey=${this.apiKey}`;
      const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(baseNewsUrl)}`;

      const response = await fetch(corsProxyUrl);
      const result = await response.json();
      const data = JSON.parse(result.contents);

      this.setState({
        articles: data.articles || [],
        totalResults: data.totalResults || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching news via CORS proxy:', error);
      this.setState({ error: 'Failed to fetch news.', loading: false });
    }
  };

  renderNewsComponent = (category) => (
    <News
      key={category}
      category={category}
      pageSize={this.pageSize}
      articles={this.state.articles}
      totalResults={this.state.totalResults}
      loading={this.state.loading}
      error={this.state.error}
    />
  );

  render() {
    const { showSplash, isMobile } = this.state;

    return (
      <div className="d-flex flex-column min-vh-100">
        {showSplash && (
          isMobile
            ? <SplashScreenMobile onComplete={this.handleSplashComplete} />
            : <SplashScreen onComplete={this.handleSplashComplete} />
        )}

        <BrowserRouter>
          <NavBar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={this.renderNewsComponent('general')} />
              <Route path="/business" element={this.renderNewsComponent('business')} />
              <Route path="/entertainment" element={this.renderNewsComponent('entertainment')} />
              <Route path="/general" element={this.renderNewsComponent('general')} />
              <Route path="/health" element={this.renderNewsComponent('health')} />
              <Route path="/science" element={this.renderNewsComponent('science')} />
              <Route path="/sports" element={this.renderNewsComponent('sports')} />
              <Route path="/technology" element={this.renderNewsComponent('technology')} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default withRouter(App);
