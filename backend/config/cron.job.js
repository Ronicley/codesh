const CronJob = require('cron').CronJob;
const Product = require('../app/models/product.model')
const ProductsScraper = require('../app/controller/webscraper.controller')

// const dayMinutes = 59;
// const dayHour = 23

const dayMinutes = 43;
const dayHour = 13


module.exports.job = new CronJob(`${dayMinutes} ${dayHour} * * *`, async function () {
    console.log("----------------------------------")
    console.log("Runnig cron job")
    await ProductsScraper.scrape()
    .then(async (products) => {
        Product.insertMany(products)
        .then(function () {
            console.log("Data inserted")  // Success
        })
        .catch(function (error) {
            console.log(error)      // Failure
        });
    }).catch((e) => {
        console.error(e)
    })
    console.log("Finish cron job")
    console.log("----------------------------------")
});
