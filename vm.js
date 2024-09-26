function trim(num) {
	return num & (2**16)
}

class Computer {
	processor;
	memory;
	output;
	input;
	debug;
}

class Processor {

}

class Memory {
	#data;

	constructor() {
		this.#data = Array.apply(null, Array(2 ** 16)).map(() => 0);
	}

	read(address) {
		return this.#data[trim(address)];
	};
	write(address, value) {
		this.#data[trim(address)] = trim(value);
	};
}