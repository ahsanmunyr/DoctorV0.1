import RtcEngine from 'react-native-agora'

const appId='42ee6fd415a64032bcad2f6ff835e396';


export async function joinCall(token,channel,id){
    const _engine = await RtcEngine.create(appId)
    // await _engine.leaveChannel()
    await _engine.joinChannel(token, channel, null, id).catch(ee=>console.log("ee",ee))
}