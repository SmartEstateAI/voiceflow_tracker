const RedisRateLimiter = require('../utils/redis-rate-limiter')
const RedisClient = require("../utils/redis-client");
class VoiceFlowProxyHandler {

    static interact = async (req, res) => {
        const { projectId, userId } = req.params;

        const canUseProxy = await RedisRateLimiter.call(req);

        console.log('canUseProxy', canUseProxy);

        if (!canUseProxy) {
            return res.status(429).send('Maximal usage exceeded');
        }

        // Build base URL
        const baseUrl = `${process.env.VOICE_FLOW_HOST}/state/${projectId}/user/${userId}/interact`;

        // Append any query parameters from the original request
        const url = new URL(baseUrl);
        url.search = new URLSearchParams(req.query).toString();

        console.log('url', url.toString())

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.VOICEFLOW_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            // const data = await response.json();
            // res.status(response.status).json(data);
            const data = await response.json();
            res.json(data);
        } catch (err) {
            console.error('❌ Voiceflow proxy error:', err);
            res.status(500).json({ error: 'Internal proxy error' });
        }
    };

    static widget = async (req, res) => {
        const { projectId, userId } = req.params;

        // forward to Voice flow DM API
        const response = await fetch(
            `${process.env.VOICE_FLOW_HOST}/v2/public/${projectId}/settings/widget`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${process.env.VOICEFLOW_API_KEY}` }
            }
        );
        const data = await response.json();
        res.json(data);
    }

    static transscripts = async (req, res) => {
        const { projectId, userId } = req.params;

        // forward to Voice flow DM API
        const response = await fetch(
            `${process.env.VOICE_FLOW_HOST}/public/${projectId}/transcripts`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${process.env.VOICEFLOW_API_KEY}` }
            }
        );
        const data = await response.json();
        res.json(data);
    }
}

module.exports = VoiceFlowProxyHandler