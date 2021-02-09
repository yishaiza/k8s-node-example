const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const requests = [];

const getServerName = () => {
    const os = require('os')
    return os.hostname()
}

let otherServiceUrl;
const otherServicePort = process.env.otherServicePort

if(otherServicePort){
    otherServiceUrl = `service1:${otherServicePort}`
}
else {
    // console.log('otherServiceUrl hardcoded')
    otherServiceUrl = 'localhost:4001'
}
console.log({otherServiceUrl})

// const otherServiceUrl = process.env.server1 || 'http://localhost:4001'
// const otherServiceUrl = 'http://service1'

app.use(cors());

app.get('/', (req, res) => {
    res.send({'hello': 'server2', 'name': getServerName()});
});

app.get('/requests', (req, res) => {
    console.log('new request')

    requests.push(new Date())
    res.send({
        'server': 'server2',
        'name': getServerName(),
        'count': requests.length,
        requests
    });
});

app.get('/requests-other', async (req, res) => {
    try {
        const url = `http://${otherServiceUrl}/requests`
        console.log('requests-other')
        console.log({url})
        const result = await axios.get(url)
        const {data} = result
        console.log('result', data)

        res.send({
            'result from': 'server1', 'name': getServerName(),
            data
        });
    } catch (e) {
        console.log(e)
        res.send({
            'error': e,
        });
    }
});

const port = process.env.port || 4002;

app.listen(port, () => {
    console.log(`listening to : ${port}`);
});
