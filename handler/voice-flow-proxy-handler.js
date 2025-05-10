const RedisRateLimiter = require('../utils/redis-rate-limiter')
class VoiceFlowProxyHandler {

    static interact = async (req, res) => {
        const { projectId, userId } = req.params;
        const { input } = req.body;

        const canUseProxy = await RedisRateLimiter.call(req);

        if (!canUseProxy){
            res.send('maximal usage exceeded');
            return;
        }

        // forward to Voiceflow DM API
        const response = await fetch(
            `https://general-runtime.voiceflow.com/state/${projectId}/user/${userId}/interact`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${process.env.VOICEFLOW_API_KEY}` },
                body: JSON.stringify({ input }),
            }
        );
        const data = await response.json();
        res.json(data);
    }
}

module.exports = VoiceFlowProxyHandler