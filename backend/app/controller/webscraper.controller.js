const puppeteer = require('puppeteer');


const getAllProductsUrl = async (page) => {
    return await page.evaluate(() => Array.from(document.querySelectorAll('.list_product_a'), element => element.href));
}

module.exports.scrape = async (page_number) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://world.openfoodfacts.org", { waitUntil: 'domcontentloaded' });

    const urls = await getAllProductsUrl(page);

    let productList = []

    try {
        for (let index = 0; index < urls.length; index++) {
            await page.goto(urls[index], { waitUntil: 'domcontentloaded' });

            let product = await page.evaluate(() => {
                let element = document.querySelectorAll('#barcode')[0]
                let barcode = element.innerHTML
                element.parentNode.removeChild(element)

                let barcode_paragraph = document.querySelectorAll('#barcode_paragraph')[0].innerHTML
                .replace("Barcode:", "")
                .replace("\n", "")
                .replace(")\n", ")")
                .trim();

                let productUrlPicture = `https://static.openfoodfacts.org/images/products/${barcode.length <= 8 ? barcode : barcode.split(/(...)(...)(...)(.*)/).filter(e => e != '').join('/')}`

                let categories = ''
                let packaging = ''
                let brands = ''

                document.querySelectorAll('p > a')
                    .forEach(
                        (element) => {
                            let link = element.href
                            if (link.includes('category')) {
                                categories += element.innerText + ", "
                            } else if (link.includes('packaging')) {
                                packaging += element.innerText + ", "
                            } else if (link.includes('brand')) {
                                brands += element.innerText + ", "
                            }
                        }
                    )

                let quantity = ''
                document.querySelectorAll('p')
                    .forEach(
                        (element) => {
                            if(element.innerText.includes("Quantity:")){
                                quantity = element.innerText.replace("Quantity: ", "")
                            }
                        }
                    )

                return {
                    code: barcode,
                    barcode: `${barcode}${barcode_paragraph}`,
                    status: "imported",
                    imported_t: new Date().toISOString(),
                    url: document.URL,
                    product_name: document.querySelectorAll('div > h1')[0].innerHTML,
                    quantity: quantity,
                    categories: categories + "",
                    packaging: packaging + "",
                    brands: brands + "",
                    image_url: productUrlPicture
                }
            });
            productList.push(product)
        }

    } catch (e) {
        console.error(e)
    }


    await browser.close();
    return productList;
}

