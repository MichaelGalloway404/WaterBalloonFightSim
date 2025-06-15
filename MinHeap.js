// Min Heap MODDED for object with possible two sub fields deep for comparison
export class MinHeap {
	constructor(type=null,subType=null) {
		this.heap = [];
        this.type = type;
        this.subType = subType;
	}
	getLeftChildIndx(parentIndx) {
		return 2 * parentIndx + 1;
	}
	getRightChildIndx(parentIndx) {
		return 2 * parentIndx + 2;
	}
	getParentIndx(childIndx) {
		return Math.floor((childIndx - 1) / 2);
	}
	getLeftChild(indx) {
		return this.heap[this.getLeftChildIndx(indx)]?.[this.type]?.[this.subType];
	}
	getRightChild(indx) {
		return this.heap[this.getRightChildIndx(indx)]?.[this.type]?.[this.subType];
	}
	getParent(indx) {
		return this.heap[this.getParentIndx(indx)]?.[this.type]?.[this.subType];
	}
	
	swap(indx1, indx2) {
		const temp = this.heap[indx1];
		this.heap[indx1] = this.heap[indx2];
		this.heap[indx2] = temp;
	}

	peek() {
		if (this.heap.length === 0) {
			return null;
		}
		return this.heap[0];
	}

	remove() {
		if (this.heap.length === 0) {
			return null;
		}
		const item = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.heapDown();
		return item;
	}

	add(element) {
		this.heap.push(element);
		this.heapUp();
	}

	heapUp() {
		let indx = this.heap.length - 1;
		while (this.getParentIndx(indx) >= 0 && this.getParent(indx) > this.heap[indx]?.[this.type]?.[this.subType]) {
			this.swap(this.getParentIndx(indx), indx);
			indx = this.getParentIndx(indx);
		}
	}

	heapDown() {
		let indx = 0;
		while (this.getLeftChildIndx(indx) < this.heap.length) {
			let lesserChildIndx = this.getLeftChildIndx(indx);
			if (this.getRightChildIndx(indx) < this.heap.length && this.getRightChild(indx) < this.getLeftChild(indx)) {
				lesserChildIndx = this.getRightChildIndx(indx);
			}
			if (this.heap[indx]?.[this.type]?.[this.subType] < this.heap[lesserChildIndx]?.[this.type]?.[this.subType]) {
				break;
			} else {
				this.swap(indx, lesserChildIndx);
			}
			indx = lesserChildIndx;
		}
	}
}