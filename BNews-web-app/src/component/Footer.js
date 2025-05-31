import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Footer extends Component {
    render() {
        const socialLinks = [
            { url: process.env.REACT_APP_FACEBOOK, icon: 'fab fa-facebook', label: 'Facebook' },
            { url: process.env.REACT_APP_INSTAGRAM, icon: 'fab fa-instagram', label: 'Instagram' },
            { url: process.env.REACT_APP_LINKEDIN, icon: 'fab fa-linkedin', label: 'LinkedIn' },
            { url: process.env.REACT_APP_GITHUB, icon: 'fab fa-github', label: 'GitHub' },
            { url: process.env.REACT_APP_TWITTER, icon: 'fab fa-twitter', label: 'Twitter' }
        ];

        return (
            <footer className="bg-dark text-light py-4 mt-5">
                <div className="container">
                    <div className="row justify-content-center mb-4">
                        <div className="col-12 text-center">
                            <h5 className="mb-4">Connect With Me</h5>
                            <div className="social-links">
                                {socialLinks.map((social, index) => (
                                    <a 
                                        key={index}
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-light mx-3"
                                        title={social.label}
                                    >
                                        <i className={`${social.icon} fa-lg`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <hr className="bg-light" />
                    <div className="text-center">
                        <p className="mb-0">
                            Copyright <i className="far fa-copyright"></i> {new Date().getFullYear()} {process.env.REACT_APP_CREATOR_NAME}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer; 