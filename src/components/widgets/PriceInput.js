import React from 'react';
import NumberInput from 'react-number-input';

import { getNicePriceFromCent } from 'utils/price';
import { IconText } from 'components/dianping/IconText';

export const PriceOne = ({ prices, update }) => {
  let price0 = (prices && prices[0]) || {};
  let { price } = price0;
  price = getNicePriceFromCent(price);

  let updatePrice = value => {
    let value2 = (value && parseInt(value * 100)) || 0;
    update([{ price: value2 }]);
  };
  return (
    <div>
      <NumberInput
        className="form-input"
        type="text" // optional, input[type]. Defaults to "tel" to allow non numeric characters
        onChange={value => updatePrice(value)} // function (value: number | null, event: Event)
        value={price || ''} // normal react input binding
        placeholder="现价" // all other input properties are supported
        format="0,0[.]00" // optional, numbro.js format string. Defaults to "0,0[.][00]"
      />
    </div>
  );
};

export const PricePair = ({ prices, update }) => {
  let price0 = (prices && prices[0]) || {};
  let { price, past } = price0;
  price = getNicePriceFromCent(price);
  past = getNicePriceFromCent(past);
  //price = (price && parseFloat(price / 100)) || '';
  //past = (past && parseFloat(past / 100)) || '';
  let updatePrice = (name, value) => {
    let value2 = (value && parseInt(value * 100)) || 0;
    update([{ ...price0, [name]: value2 }]);
  };
  return (
    <div>
      <NumberInput
        className="form-input"
        type="text" // optional, input[type]. Defaults to "tel" to allow non numeric characters
        onChange={value => updatePrice('price', value)} // function (value: number | null, event: Event)
        value={price || ''} // normal react input binding
        placeholder="现价" // all other input properties are supported
        format="0,0[.]00" // optional, numbro.js format string. Defaults to "0,0[.][00]"
      />
      <NumberInput
        className="form-input"
        type="text" // optional, input[type]. Defaults to "tel" to allow non numeric characters
        onChange={value => updatePrice('past', value)} // function (value: number | null, event: Event)
        value={past || ''} // normal react input binding
        placeholder="原价" // all other input properties are supported
        format="0,0[.]00" // optional, numbro.js format string. Defaults to "0,0[.][00]"
      />
    </div>
  );
};

export const PriceMulti = ({ prices, update }) => {
  let delPrice = index => {
    let nextPrices = prices && prices.slice(0);
    nextPrices && nextPrices.splice(index, 1);
    update(nextPrices);
  };

  let addPrice = () => {
    let nextPrices = prices || [];
    nextPrices = [...nextPrices, { name: '', price: '' }];
    update(nextPrices);
  };

  let updPrice = (index, value) => {
    let value2 = (value && parseInt(value * 100)) || 0;
    let item = prices && prices[index];
    if (item) {
      let nextPrices = prices.slice(0);
      nextPrices[index] = { ...item, price: value2 };
      update(nextPrices);
    }
  };
  let updName = (index, value) => {
    let item = prices && prices[index];
    if (item) {
      let nextPrices = prices.slice(0);
      nextPrices[index] = { ...item, name: value };
      update(nextPrices);
    }
  };

  let uiPrices =
    prices &&
    prices.map((item, index) => {
      let { price, name } = item || {};
      //price = (price && parseFloat(price / 100)) || '';
      price = getNicePriceFromCent(price);
      return (
        <div key={index} className="m-2">
          <div>
            <IconText
              name={'价格' + (index + 1)}
              iconFront="fa fa-minus-circle"
              iconFrontFunc={() => delPrice(index)}
              textFunc={() => delPrice(index)}
              textStyle={{
                lineHeight: '1.5rem',
                fontSize: '1rem',
                color: '#f93'
              }}
            />
          </div>
          <span>
            <NumberInput
              className="form-input"
              type="text" // optional, input[type]. Defaults to "tel" to allow non numeric characters
              onChange={value => updPrice(value)} // function (value: number | null, event: Event)
              value={price || ''} // normal react input binding
              placeholder="价格" // all other input properties are supported
              format="0,0[.]00" // optional, numbro.js format string. Defaults to "0,0[.][00]"
            />
            <input
              type="text"
              className="form-input"
              value={name || ''}
              onChange={evt => updName(index, evt.target.value)}
              placeholder="价格说明（10字以内）"
            />
          </span>
        </div>
      );
    });

  return (
    <div>
      {uiPrices}
      <div className="m-2">
        <IconText
          name={'增加新价格'}
          iconFront="fa fa-plus-circle"
          iconFrontFunc={() => addPrice()}
          textFunc={() => addPrice()}
          textStyle={{
            lineHeight: '1.5rem',
            fontSize: '1rem',
            color: '#f93'
          }}
        />
      </div>
    </div>
  );
};
