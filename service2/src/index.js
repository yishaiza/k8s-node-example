const express = require('express');
const axios = require('axios');

const app = express();
const requests = [];

const getServerName = () => {
    const os = require('os')
    return os.hostname()
}

const otherServiceUrl = process.env.server1 || 'http://localhost:4001/requests'

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
        const result = await axios.get(otherServiceUrl)
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
