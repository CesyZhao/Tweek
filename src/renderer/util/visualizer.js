import decoder from './audioDecode'
let ra = requestAnimationFrame;
let visualizer,audio,width,height;
export default function visualize(v,a){
    visualizer = v;
    width = v.width;
    height = v.height;
    audio = a;
    draw();
}
function draw(){
    ra(draw)
    let p = visualizer.getContext("2d");
    let gradient = p.createLinearGradient(0, 100, 375, 100);
    gradient.addColorStop("0", "#f500d8");
    gradient.addColorStop("1.0", "#ceaf11");
    let gradientRight = p.createLinearGradient(719, 100, 1044, 100);
    gradientRight.addColorStop("0", "#0ee7f7");
    gradientRight.addColorStop("1.0", "#2ce672");
    let dataArray = decoder(audio);

    p.beginPath();
	p.moveTo(0, height - 200);
	var x = 0;
	for (var i = 1; i < 42; i++) {
		var lineHeight = dataArray[i] / 256 * height / 3;
		if (i < 5) {
			p.lineTo(x, height - dataArray[i] / 256 * height / 2 - 200)
		} else if (i > 40) {
			p.lineTo(x - 13, height - 200)
		} else {
			p.lineTo(x, height - lineHeight - 200)
		}
		x += 12;
	}
	p.fillStyle = gradient;
	p.fill();
	p.closePath();




	//左线条
	p.beginPath();
	p.moveTo(0, height - 200);
	var x = 0;
	for (var i = 1; i < 42; i++) {
		var lineHeight = dataArray[i] / 256 * height / 3;
		if (i < 5) {
			p.lineTo(x, height - dataArray[i] / 256 * height / 2 - 210 - Math.floor(Math.random() * 30))
		} else if (i > 40) {
			p.lineTo(x - 13, height - 220)
		} else {
			p.lineTo(x, height - lineHeight - 210 - Math.floor(Math.random() * 30))
		}
		x += 12;
	}
	p.strokeStyle = gradient;
	p.stroke();
	p.closePath();


	//清除左侧底部部分频谱
	p.fillStyle = '#fff';
	p.fillRect(0, height - 300, 470, 101);

	//左倒影
	p.beginPath();
	p.moveTo(0, height - 299);
	var x = 0;
	for (var i = 1; i < 41; i++) {
		var lineHeight = dataArray[i] / 256 * height / 50;
		if (i < 5) {
			p.lineTo(x, dataArray[i] / 256 * height / 24 + 380)
		} else p.lineTo(x, lineHeight + 380)
		x += 12;
	}
	p.lineTo(x - 12, height - 299)
	p.fillStyle = '#21dd13';

	p.shadowBlur = 20;
	p.shadowColor = "#21dd13";
	p.fill();
	p.closePath();
	p.shadowBlur = 0;



	//右

	//右填充
	p.beginPath();
	p.fillStyle = gradientRight;
	p.moveTo(width, height - 200);
	var x = width;
	for (var i = 1; i < 42; i++) {
		var lineHeight = dataArray[i] / 256 * height / 3;
		if (i < 5) {
			p.lineTo(x, height - dataArray[i] / 256 * height / 2 - 200)
		} else if (i > 40) {
			p.lineTo(x + 12, height - 200)
		} else {
			p.lineTo(x, height - lineHeight - 200)
		}
		x -= 12;
	}
	p.fill();
	p.closePath();

	//右线条
	p.beginPath();
	p.moveTo(width, height - 200);
	var x = width;
	for (var i = 1; i < 42; i++) {
		var lineHeight = dataArray[i] / 256 * height / 3;
		if (i < 5) {
			p.lineTo(x, height - dataArray[i] / 256 * height / 2 - 210 - Math.floor(Math.random() * 30))
		} else if (i > 40) {
			p.lineTo(x + 12, height - 200)
		} else {
			p.lineTo(x, height - lineHeight - 210 - Math.floor(Math.random() * 30))
		}
		x -= 12;
	}
	p.strokeStyle = gradientRight;
	p.stroke();
	p.closePath();

	//清除右侧底部部分频谱
	p.fillStyle = '#fff';
	p.fillRect(width - 480, height - 300, 480, 100);


	//右倒影
	p.beginPath();
	p.moveTo(width, height - 299);
	var x = width;
	for (var i = 1; i < 41; i++) {
		var lineHeight = dataArray[i] / 256 * height / 50;
		if (i < 5) {
			p.lineTo(x, dataArray[i] / 256 * height / 24 + 380)
		} else p.lineTo(x, lineHeight + 380)
		x -= 12;
	}
	p.lineTo(x + 12, height - 299)
	p.fillStyle = '#21dd13';

	p.shadowBlur = 20;
	p.shadowColor = "#21dd13";
	p.fill();
	p.closePath();
	p.shadowBlur = 0;

}