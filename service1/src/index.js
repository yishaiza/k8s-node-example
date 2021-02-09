const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const requests = [];

// const otherServiceUrl = 'http://localhost:4002'
// const otherServiceUrl = process.env.server1 || 'http://localhost:4002'
// const otherServiceUrl = 'http://service2'


const getServerName = () => {
    const os = require('os')
    return os.hostname()
}

let otherServiceUrl;
const otherServicePort = process.env.otherServicePort

if(otherServicePort){
    otherServiceUrl = `service2:${otherServicePort}`
}
else {
    otherServiceUrl = 'localhost:4002'
}
console.log({otherServiceUrl})

app.use(cors());

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
        const url = `http://${otherServiceUrl}/requests`
        console.log('requests-other')
        console.log({url})
        const result = await axios.get(url)
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
