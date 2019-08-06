function private(x) {
	return (
		(function() {
			let locked = x;
			return {
				get get() {
					return locked;
				},
				set set(xx) {
					locked = xx;
				}
			}
		})()
	)
}

function spriting(img, SpriteWidth, SpriteHeight, DeletedInTheEnd = 0, H_or_V = "H") {
	let data = []
	let wid = img.width / SpriteWidth;
	let hei = img.height / SpriteHeight;
	if (H_or_V[0] == "h" || H_or_V[0] == "H") {
		for (var i = 0; i < SpriteHeight; i++) {
			for (var j = 0; j < SpriteWidth; j++) {
				data.push(img.get(j * wid, i * hei, wid, hei))
			}
		}
	} else if (H_or_V[0] == "V" || H_or_V[0] == "v") {
		for (var i = 0; i < SpriteWidth; i++) {
			for (var j = 0; j < SpriteHeight; j++) {
				data.push(img.get(i * wid, j * hei, wid, hei))
			}
		}
	}
	if (DeletedInTheEnd > 0) {
		data.splice(this.length - DeletedInTheEnd, DeletedInTheEnd);
	}
	return data;
}
//sorting
function sortArr(arr,isReversed=false,newArray=false){
	if(newArray){
		let arr1=[...arr];
		if(!isReversed){
			arr1.sort((a,b)=>a-b)
		}else{
			arr1.sort((a,b)=>b-a)
		}
		return arr1
	}else{
		if(!isReversed){
			arr.sort((a,b)=>a-b)
		}else{
			arr.sort((a,b)=>b-a)

		}
	}
}
function centerCanvas() {
  select("canvas").position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
