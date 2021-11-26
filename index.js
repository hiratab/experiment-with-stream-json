const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const { Writable } = require('stream');

// const pipeline = fs.createReadStream('contentUrlsReduced.json')
//   .pipe(StreamArray.withParser());

// pipeline.on('data', data => console.log(data));

const somePromiseFunction = (value) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('somePromiseFunction value', value);
            resolve(value);
        }, 5000);
    })
}

const someAsyncFunction = async (value, callback) => {
    console.log('calling somePromiseFunction');
    await somePromiseFunction(value);
    console.log('calling callback');
    callback();
}

(async () => {
    const fileReadStream = fs.createReadStream('contentUrlsReduced.json');
    const jsonStream = StreamArray.withParser();
    const processingStream = new Writable({
        write({ value }, encoding, callback) {
            console.log('processingStream write calling someAsyncFunction');
            someAsyncFunction(value, callback);
        },
        objectMode: true
    });

    fileReadStream.pipe(jsonStream.input);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => console.log('All done'));
})();

