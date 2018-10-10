let ac = new (AudioContext || webkitAudioContext)();

let analyser  = ac.createAnalyser();
let source ;
const num = 2048;
analyser.fftSize = num * 2;
let dataArray = new Uint8Array(num * 2)

export default function audioDecode(audioElement){
    // let audioElement = document.getElementById('player')
    !source ? source = ac.createMediaElementSource(audioElement):''
    source.connect(analyser);
    analyser.connect(ac.destination);
    analyser.getByteFrequencyData(dataArray);
    // console.log(dataArray);
    return dataArray;
}