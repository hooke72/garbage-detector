# garbage-detector

Does the sentence make sense? Or maybe it's just a kind of garbage string? The analyzer tries to answer this.


## Install

[npm][]:

```sh
npm install garbage-detector
```

[yarn][]:

```sh
yarn add garbage-detector
```

## Usage

Simple using the following
```js
const garbageDetector = require ("garbage-detector")

const result = await garbageDetector.check("Does the sentence make sense?")

console.log(result.isGood) //   true || false
```
Extended usage example:
```js
const dictionaryLevel = 0.5 // default value. It's a level of make decision of the sentence by a number of words found in the dictionary.

const sentimentalLevel = 0.12 // default value. You can find out a meaning at [Natural module](http://naturalnode.github.io/natural/).

const result = await garbageDetector.check("Does the sentence make sense?", 0.8, 0.25)
```
Also, you can get a more information about the sentence.
Result object description:

- err,  Contains an error message if it is present or null.
- isGood, boolean. This is true if the sentence seems to make sense.
- detailed object

Detailed object description:
- totalWords, number of words in the sentence
- dictionaryCount, number of words that are found in a dictionary
- isDictionaryGood, boolean. This is true if dictionaryCount more than dictionaryLevel
- sentimentalMax, number. Max value of sentimental which counted by all the methods.
- isSentimentalGood, boolean. This is true if counted sentimental more than sentimentalLevel
- overallGood, true. This is true if any of methods have positive decisions.
- sentimentalRaw, array of raw data from sentimental analysis for each method. 
- dictionaryRaw, array of raw data from dictionary analysis for each word.


## History

12/20/2021 V 1.0.0 Released version

## Credits

Special thanks to the authors and contributors of [Natural](http://naturalnode.github.io/natural/)

## License
MIT License

Copyright (c) 2021 Andrii Hooke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
