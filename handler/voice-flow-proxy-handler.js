const RedisRateLimiter = require('../utils/redis-rate-limiter')
const RedisClient = require("../utils/redis-client");
class VoiceFlowProxyHandler {

    static interact = async (req, res) => {
        const { projectId, userId } = req.params;

        const canUseProxy = await RedisRateLimiter.call(req);

        if (!canUseProxy){
            res.send('maximal usage exceeded');
            return;
        }

        // forward to Voice flow DM API
        const response = await fetch(
            `${process.env.VOICE_FLOW_HOST}/state/${projectId}/user/${userId}/interact?`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${process.env.VOICEFLOW_API_KEY}` },
                body: JSON.stringify(req.body),
            }
        );
        const data = await response.json();
        res.json(data);
    }

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
}

module.exports = VoiceFlowProxyHandler