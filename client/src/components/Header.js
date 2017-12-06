import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const navColor = {
  backgroundColor: '#0F3E86'
  // borderTopLeftRadius: '10px',
  // borderTopRightRadius: '10px'
};

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        return (
          <li>
            <a href="/api/logout">Logout</a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav style={navColor}>
        <div className="nav-wrapper" style={navColor}>
          <Link
            to={this.props.auth ? '/calendar' : '/'}
            className="left brand-logo"
            style={{ marginLeft: '10px' }}
          >
            Study Pal
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
