const axios =  require('axios')
const cheerio =  require('cheerio')

async function getSite(url){
    return await axios.get(url)
}

function getAllURL(url){
    let urls = []
    for(let i = 1 ; i <= 20; i++){      
        urls.push(url+`?page=${i}`)
    }
    return urls
}

async function sortable(notebooks){
    const notebookSortable = await notebooks

    notebooks.sort((a,b)=>{
        return a.price - b.price
    })
    return notebookSortable
}

async function getNotebooks(){
    const url = "https://webscraper.io/test-sites/e-commerce/static/computers/laptops"
    const urlRoot = "https://webscraper.io"
    let allUrl =  getAllURL(url)
    let productLenovo = []
    
   for (link in allUrl){
        let data = await getSite(allUrl[link])
        let $ = cheerio.load(data.data)
        

       $('div.thumbnail').each(async (i,e)=>{
            const linkProduct = $(e).find('h4 > a.title').attr('href')
            const image = $(e).find('div.card-body > img.image').attr('src')
            const description = $(e).find('p.description').text()
            const price = $(e).find('h4.price').text()
            const review = $(e).find('div.ratings > p.review-count' ).text()
            const star = $(e).find('div.ratings > p > span.ws-icon-star').length
            
            let product = await getSite(urlRoot+linkProduct)
            let $product = cheerio.load(product.data)

            let name = $product('div.thumbnail').find('div.caption > h4.title').text()
            
            let codProd = linkProduct.split("/")

            let nameSplit = name.split(" ")
                   
            if(nameSplit[0].toLowerCase() === 'lenovo' | nameSplit.includes("ThinkPad")){
                
                productLenovo.push({
                    id:parseInt(codProd[codProd.length-1]),
                    name:name,
                    image:urlRoot+image,
                    description:description,
                    price:parseFloat(price.replace('$','')),
                    review:review,
                    star:star,
                    link:urlRoot+linkProduct  
                })
            }
                
        })
    }

    let lenovoSorteble = sortable(productLenovo)

    return lenovoSorteble
}


module.exports =  getNotebooks()