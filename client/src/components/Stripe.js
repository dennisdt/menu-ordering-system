import React, { Component } from 'react';
import ReactStripeCheckout from 'react-stripe-checkout';
import { Row, Col } from 'react-materialize';

class Stripe extends Component {
  render(){
    return(

          <div className="center section">
            <ReactStripeCheckout
              amount={100}
              token={token => console.log(token)}
              stripeKey={process.env.REACT_APP_STRIPE_KEY}
              name="Tellem Kevin"
              description="I also accept nudes.">
                <button className="btn purple accent-1">Donate</button>
            </ReactStripeCheckout>
          </div>

    );
  }
}

export default Stripe;
