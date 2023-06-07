const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find().exec();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    console.error('Error retrieving short URLs:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating short URL:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/:shortUrls',async(req,res) =>{

    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrls})
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Server started on port 5000');
});
