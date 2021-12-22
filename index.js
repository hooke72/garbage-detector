'use strict';
/*
Copyright (c) 2021, Andrii Hooke
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const natural = require('natural');
const english = require("./english.json")

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer
const Analyzer = natural.SentimentAnalyzer;

const types = {
    affin: "afinn",
    senticon: "senticon",
    pattern: "pattern"
}

const languages = {
    english: "English",
    noDetected: "No Detected",
}

const analyserTypes = [
    { language: languages.english, type: types.affin},
    { language: languages.english, type: types.senticon},
]

const check = async function(text = "", dictionaryLevel = 0.5, sentimentalLevel = 0.12) {
    try {
        text = text.toString().replace(/[^a-zA-Z ]/g, " ").toLowerCase()
        const detailed = await checkSentence(text, dictionaryLevel, sentimentalLevel)
        return {err: null, isGood: detailed.overallGood, detailed}
    } catch (err) {
        return {err, isGood: false, detailed: {}}
    }

}

async function checkSentence(text, dictionaryLevel, sentimentalLevel) {
    const detailed = {}
    const sentimental = []
    const sentimentalRaw = []
    const tokens = tokenizer.tokenize(text)
    const steams = stemmer.tokenizeAndStem(text)

    for (let analyserType of analyserTypes){
        const res = await getSentimentalFor(analyserType.language, analyserType.type, tokens)
        sentimental.push(res.value)
        sentimentalRaw.push(res)
    }

    detailed.totalWords = tokens.length
    detailed.sentimentalRaw = sentimentalRaw
    detailed.sentimentalMax = Math.max(...sentimental)
    detailed.isSentimentalGood = detailed.sentimentalMax >= sentimentalLevel

    const {count, dictionaryRaw} = await countCommonWord(steams, tokens)
    detailed.dictionaryRaw = dictionaryRaw
    detailed.dictionaryCount = count
    detailed.isDictionaryGood = count/steams.length >= dictionaryLevel

    detailed.overallGood = detailed.isSentimentalGood || detailed.isDictionaryGood
    return detailed;
}

async function getSentimentalFor(language, type, tokens){
    const analyzer = new Analyzer(language, stemmer, type)
    const value = Math.abs(analyzer.getSentiment(tokens))
    return {language, type, value}
}

async function countCommonWord(arraySteams, arrayWords) {
    const dictionaryRaw = []
    if (arrayWords.length <= 0 ){ return 0}
    let count = 0
    for (let i in arrayWords){
        if (arrayWords.hasOwnProperty(i)) {
            let isFound = false
            if (english.includes(arrayWords[i]) || english.includes(arraySteams[i])) {
                dictionaryRaw.push({word: arrayWords[i], language: languages.english})
                isFound = true
                count += 1
            } else {
                dictionaryRaw.push({word: arrayWords[i], language: languages.noDetected})
            }
        }
    }
    return {count, dictionaryRaw}
}


exports.check = check
