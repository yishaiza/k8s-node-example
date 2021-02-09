const express = require('express');
const axios = require('axios');

const app = express();
const requests = [];

const otherServiceUrl = process.env.server1 || 'http://localhost:4002/requests'

const getServerName = () => {
    const os = require('os')
    return os.hostname()
}

app.get('/', (req, res) => {
    res.send({'hello': 'server1', 'name': getServerName()});
});

app.get('/requests', (req, res) => {
    console.log('new request')

    requests.push(new Date())
    res.send({
        'server': 'server1',
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
            'result from': 'server2', 'name': getServerName(),
            data
        });
    } catch (e) {
        console.log(e)
        res.send({
            'error': e,
        });
    }
});

const port = process.env.port || 4001;

app.listen(port, () => {
    console.log(`listening to : ${port}`);
});
