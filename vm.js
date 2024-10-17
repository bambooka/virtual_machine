const WORD_LENGTH = 8;
const WORD_BYTES_FOR_COMMAND = 5;

const CMD = Object.freeze({
    CLEAR: 0, // set all registers to 0
	LOAD: 1, // load memory[current+1] to selected arg
	ADD: 2, // rslt = arg_0 + arg_1
	MOVE: 3, // memory[memory[current+1]] = rslt
	GOTO: 4, // current = memory[current+1]
});

const OPTIONS = Object.freeze({
	ARG_0: 0b00000000,
	ARG_1: 0b00100000,
});

function trim(num) {
	return num & ((2**WORD_LENGTH) - 1)
}

class Computer {
	processor;
	memory;
	output;
	input;
	debug;

	constructor(processor, memory) {
		this.processor = processor;
		this.memory = memory;
	}
}

class Processor {
	current = 1;

	arg_0 = 0;
	arg_1 = 0;
	rslt = 0;

	#commands = {
		[CMD.CLEAR]: function (processor, memory, args) {
			processor.arg_0 = 0;
			processor.arg_1 = 0;
			processor.rslt = 0;

			processor.current++;
		},
		[CMD.LOAD]: function (processor, memory, args) {
			let value = memory.read(processor.current + 1);
			if (args === 0b000) {
				processor.arg_0 = value;
			} else if (args === 0b001) {
				processor.arg_1 = value;
			}
			
			processor.current += 2;
		},
		[CMD.ADD]: function (processor, memory, args) {
			processor.rslt = processor.arg_0 + processor.arg_1;
			processor.current++;
		},
		[CMD.MOVE]: function (processor, memory, args) {
			let writeToAddress = memory.read(processor.current + 1);
			memory.write(writeToAddress, processor.rslt);
			processor.current += 2;
		},
		[CMD.GOTO]: function (processor, memory, args) {
			processor.current = memory.read(processor.current + 1);
		}
	};

	run(memory) {
		this.#runCommand(
			memory.read(this.current)
		);
	}

	#runCommand(word) {
		let command = word & 0b11111;
		let args = word >>> WORD_BYTES_FOR_COMMAND;

		this.#commands[command](this, memory, args);
		//console.log('command: ' + command);
	}
}

class Memory {
	#data;

	constructor() {
		this.#data = Array.apply(null, Array(2 ** WORD_LENGTH)).map(() => 0);
	}

	read(address) {
		return this.#data[trim(address)];
	};
	write(address, value) {
		if (address === 0) {
			console.log(value);
			return;
		}

		this.#data[trim(address)] = trim(value);
	};
}
/////////////////////////////////////////////////////////////////////////////////
let memory = new Memory();

let program = [
	0, // reserved
	CMD.LOAD | OPTIONS.ARG_0,
	6, // 2
	CMD.LOAD | OPTIONS.ARG_1,
	7,
	CMD.ADD,
	CMD.MOVE,
	2,
	CMD.MOVE,
	0,
	CMD.GOTO,
	1,
	//////////////////////////
	0, 
];
/*
var A = 6;
while(true) {
 	print A = A + 7;
}
*/

for(let i = 0; i < program.length; i++) {
	memory.write(i, program[i]);
}

memory.write(0, 1);
console.debug(memory);

let Machine = new Computer(new Processor(), memory);

setInterval(function(){
	/*console.debug({
		"processor": Machine.processor,
		"memory": Machine.memory,
	});*/
	Machine.processor.run(Machine.memory);
}, 500);


