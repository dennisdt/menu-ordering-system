const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 0,
      currency: 'usd',
      description: 'Food order',
      source: req.body.id
    });

    const user = await req.user.save();
    res.send(user);
  });
};