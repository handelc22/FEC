/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import AddToCart from './AddToCart';
import Carousel from './Carousel';

class StyleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: [],
      selected: 0,
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.getStyles();
  }

  onClick(e) {
    this.setState({ selected: e.target.name });
  }

  getStyles() {
    const { productId } = this.props;
    $.ajax({
      type: 'GET',
      url: `/atelier/products/${productId}/styles`,
      success: (data) => {
        this.setState({ styles: data.results });
      },
    });
  }

  render() {
    const { getCart } = this.props;
    const { styles, selected } = this.state;
    const selectedStyle = styles[selected];
    const photos = selectedStyle ? selectedStyle.photos : [];
    return (
      <>
        <div className="style-selector">
          <div className="price">
            {(selectedStyle && selectedStyle.sale_price) ? (
              <>
                <span className="sale-price">{`$${selectedStyle.sale_price}`}</span>
                <span className="original-price-strikethrough">{`$${selectedStyle.original_price}`}</span>
              </>
            ) : (<span className="original-price">{selectedStyle ? `$${selectedStyle.original_price}` : ''}</span>)}
          </div>
          <div className="style-name">
            <span>STYLE: </span>
            <span>{selectedStyle ? selectedStyle.name.toUpperCase() : ''}</span>
          </div>
          {styles ? styles.map((style, index) => (
            <span key={style.style_id}>
              <span className="style-option">
                {index === Number(selected) ? <span className="checkmark">✔️</span> : ''}
                <img alt="" className={index === Number(selected) ? 'selected-thumbnail' : ''} src={style.photos[0].thumbnail_url} name={index} onClick={this.onClick} onKeyDown={this.onClick} />
              </span>
              {((index + 1) % 4) ? '' : <br />}
            </span>
          )) : ''}
          <AddToCart
            getCart={getCart}
            selectedStyle={selectedStyle ? Object.entries(selectedStyle.skus) : []}
            inStock={selectedStyle
              ? Object.values(selectedStyle.skus).reduce(((count, sku) => count + sku.quantity), 0)
              : 0}
            skus={selectedStyle ? Object.values(selectedStyle.skus).reduce((skuCount, sku) => {
              // eslint-disable-next-line no-param-reassign
              skuCount[sku.size] = sku.quantity;
              return skuCount;
            }, {}) : {}}
          />
        </div>
        <Carousel images={photos} />
      </>
    );
  }
}

StyleSelector.propTypes = {
  productId: PropTypes.number.isRequired,
  getCart: PropTypes.func.isRequired,
};

export default StyleSelector;
