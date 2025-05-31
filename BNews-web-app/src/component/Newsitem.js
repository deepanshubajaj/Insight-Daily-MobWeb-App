import React, { Component } from 'react'

export class NewsItem extends Component {
    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;
        
        // Function to get proxied image URL
        const getProxiedImageUrl = (url) => {
            if (!url) return "https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg";
            try {
                return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg`;
            } catch {
                return "https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg";
            }
        };

        return (
            <div className="my-3">
                <div className="card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        right: '0'
                    }}>
                        <span className="badge rounded-pill bg-danger">{source}</span>
                    </div>
                    <img 
                        src={getProxiedImageUrl(imageUrl)}
                        className="card-img-top" 
                        alt={title || "News"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg";
                        }}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <p className="card-text">
                            <small className="text-muted">
                                By {author || "Unknown"} on {new Date(date).toGMTString()}
                            </small>
                        </p>
                        <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark">
                            Read More
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem