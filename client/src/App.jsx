import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Header from './Header';
import ProductDetails from './components/ProductDetails/Main';
import QuestionAnswer from './components/Questions&Answers/Main';
import RatingsReviews from './components/Ratings&Reviews/Main';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onClick(e) {
    const time = String(new Date());
    const element = `#${e.currentTarget.id} ${String(e.target.tagName).toLowerCase()}${Array.from(e.target.classList).reduce((classList, className) => `${classList}.${className}`, '')}`;
    const widget = String(e.currentTarget.id);
    $.ajax({
      type: 'POST',
      url: '/atelier/interactions',
      data: JSON.stringify({ time, element, widget }),
      contentType: 'application/json',
      success: () => {
        console.log('success!');
      },
      error: (err) => {
        console.log('error:', err);
      },
    });
  }

  render() {
    const {
      match, cart, darkMode, getCart, changeTheme,
    } = this.props;
    const productId = Number(match.params.id);
    return (
      <>
        <Header cart={cart} changeTheme={changeTheme} darkMode={darkMode} />
        <div className={darkMode ? 'dark-mode' : ''}>
          <ProductDetails productId={productId} getCart={getCart} onClick={this.onClick} />
          <QuestionAnswer productId={productId} onClick={this.onClick} />
          <RatingsReviews productId={productId} onClick={this.onClick} />
        </div>
      </>
    );
  }
}

App.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  cart: PropTypes.instanceOf(Array).isRequired,
  darkMode: PropTypes.bool.isRequired,
  getCart: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

export default App;
