import React, { Component } from 'react';
import NewsItem from './Newsitem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general',
    };

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
        apiKey: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0,
            error: null,
            hasMore: true
        };
        document.title = `${this.props.category} - Insight Daily`;
    }

    // Helper method to fetch via allorigins proxy
    fetchWithProxy = async (targetUrl) => {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const encodedUrl = encodeURIComponent(targetUrl);

        const response = await fetch(proxyUrl + encodedUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        const data = await response.json();
        // allorigins returns the actual API response as a string in data.contents
        return JSON.parse(data.contents);
    }

    async updateNews() {
        try {
            const url = `https://newsapi.org/v2/everything?q=${this.props.category}&sortBy=publishedAt&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            console.log('Fetching from URL:', url);
            this.setState({ loading: true, error: null });
            
            let parsedData = await this.fetchWithProxy(url);
            
            if (parsedData.status === 'error') {
                throw new Error(parsedData.message || 'Error fetching news');
            }

            this.setState({
                articles: parsedData.articles || [],
                totalResults: parsedData.totalResults,
                loading: false,
                hasMore: (parsedData.articles || []).length === this.props.pageSize
            });
        } catch (error) {
            console.error("Error fetching news:", error);
            this.setState({
                loading: false,
                error: error.message,
                hasMore: false
            });
        }
    }

    async componentDidMount() {
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState({ page: this.state.page - 1 }, () => {
            this.updateNews();
        });
    };

    handleNextClick = async () => {
        this.setState({ page: this.state.page + 1 }, () => {
            this.updateNews();
        });
    };

    fetchMoreData = async () => {
        try {
            const nextPage = this.state.page + 1;
            const url = `https://newsapi.org/v2/everything?q=${this.props.category}&sortBy=publishedAt&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`;
            
            let parsedData = await this.fetchWithProxy(url);
            
            if (parsedData.status === 'error') {
                throw new Error(parsedData.message || 'Error fetching more news');
            }

            const newArticles = parsedData.articles || [];
            
            this.setState(prevState => ({
                articles: prevState.articles.concat(newArticles),
                totalResults: parsedData.totalResults,
                page: nextPage,
                hasMore: newArticles.length === this.props.pageSize
            }));
        } catch (error) {
            console.error("Error fetching more data:", error);
            this.setState({ 
                error: error.message,
                hasMore: false
            });
        }
    };

    render() {
        const { articles = [], error, hasMore } = this.state;
        
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>
                    Insight Daily - Top Headlines From {this.props.category}
                </h1>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={this.fetchMoreData}
                    hasMore={hasMore}
                    loader={<Spinner />}
                    style={{ overflow: 'hidden' }}
                >
                    <div className="container">
                        <div className="row">
                            {articles.map((element, index) => (
                                <div className="col-md-4" key={`${element.url}-${index}`}>
                                    <NewsItem
                                        title={element.title || ''}
                                        description={element.description || ''}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        );
    }
}

export default News;
