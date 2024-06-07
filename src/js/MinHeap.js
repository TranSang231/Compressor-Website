class MinHeap {
    constructor() {
        this.heapArray = [];
    }

    // Return the size of the heap
    size() {
        return this.heapArray.length;
    }

    // Check if the heap is empty
    isEmpty() {
        return (this.size() === 0);
    }

    // Insert a new value into the heap (Push)
    enqueue(value) {
        this.heapArray.push(value);
        this.upHeapify();
    }

    // Remove the top element from the heap (Pop)
    dequeue() {
        if (this.isEmpty() == false) {
            let lastIndex = this.size() - 1;
            this.heapArray[0] = this.heapArray[lastIndex];
            this.heapArray.pop();
            this.downHeapify();
        }
    }

    // Update the heap after inserting a new element
    upHeapify() {
        let currentIndex = this.size() - 1;
        while (currentIndex > 0) {
            let currentElm = this.heapArray[currentIndex];
            let parentIndex = Math.trunc((currentIndex - 1) / 2);   
            let parentElm = this.heapArray[parentIndex];

            if (parentElm[0] < currentElm[0]) {
                break;
            }

            this.heapArray[parentIndex] = currentElm;
            this.heapArray[currentIndex] = parentElm;
            currentIndex = parentIndex;
        }
    }

    // Return the top element of the heap
    top() {
        return this.heapArray[0];
    }

    // Update the heap after removing the top element
    downHeapify() {
        let currentIndex = 0;
        let currentElm = this.heapArray[0];
        
        while (currentIndex < this.size()) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < this.size()) {
                leftChild = this.heapArray[leftChildIndex];
                if (leftChild[0] < currentElm[0]) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < this.size()) {
                rightChild = this.heapArray[rightChildIndex];
                if ((swap === null && rightChild[0] < currentElm[0]) || (swap !== null && rightChild[0] < leftChild[0])) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) {
                break;
            }

            this.heapArray[currentIndex] = this.heapArray[swap];
            this.heapArray[swap] = currentElm;
            currentIndex = swap;
        }
    }

}

// module.exports = MinHeap;
export default MinHeap;