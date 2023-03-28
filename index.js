const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()
PORT = process.env.local || 8000
const newspapers = [
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/home/environment',
        baseUrl: ''
    },
    {
        name: 'hindustantimes',
        address: 'https://www.hindustantimes.com/environment',
        baseUrl: 'https://www.hindustantimes.com/'
    },
    {
        name: 'thehindu',
        address: 'https://www.thehindu.com/sci-tech/energy-and-environment/',
        baseUrl: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/uk/environment',
        baseUrl: ''
    },
    {
        name: 'telegraphindia',
        address: 'https://www.telegraphindia.com/topic/environment',
        baseUrl: ''
    },
    {
        name: 'indianexpress',
        address: 'https://indianexpress.com/about/environment/',
        baseUrl: ''
    },
    {
        name: 'wallstreetjournel',
        address: 'https://www.wsj.com/news/types/environment-science',
        baseUrl: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science_and_environment',
        baseUrl: 'https://www.bbc.com/'
    },

]

const articles = []

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const tile = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    tile,
                    url: newspaper.baseUrl + url,
                    source: newspaper.name
                })
            })
        }).catch((err) => console.log(err))
})


app.get('/', (req, res) => {
    res.send('all looks good')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].baseUrl

    // console.log(newspaperAddress);

    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const tile = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    tile,
                    url: newspaperBase.baseUrl + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`app is listening on ${PORT} click http://localhost:${PORT}`))