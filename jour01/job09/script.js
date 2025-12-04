function tri(numbers, order) {
	let arr = numbers.slice();

	for (let i = 0; i < arr.length - 1; i++) {
		for (let j = 0; j < arr.length - 1 - i; j++) {
			if (order === 'asc') {
				if (arr[j] > arr[j + 1]) {
					let temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
				}
			} else if (order === 'desc') {
				if (arr[j] < arr[j + 1]) {
					let temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
				}
			} else {
				console.log("Paramètre 'order' invalide : utilisez 'asc' ou 'desc'");
				return null;
			}
		}
	}

	return arr;
}

const tableau = [5, 2, 9, 1, 7];
console.log(tri(tableau, 'asc'));
console.log(tri(tableau, 'desc'));
