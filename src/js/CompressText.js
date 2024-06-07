// const MinHeap = require("./MinHeap.js");
import MinHeap from "./MinHeap.js";

class Codec {
    // dfs
    getCodes(node, curr_code) {
        // is leaf node
        if (typeof (node[1]) === "string") {
            // alternate way
            this.codes[node[1]] = curr_code;
            return;
        }

        // go left
        this.getCodes(node[1][0], curr_code + '0');
        // go right
        this.getCodes(node[1][1], curr_code + '1');
    }

    // make the huffman tree into a string
    make_string(node) {
        if (typeof (node[1]) === "string") {
            return "'" + node[1];
        }
        return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);

    }

    // make string into huffman tree
    make_tree(tree_string) {
        let node = [];
        if (tree_string[this.index] === "'") {
            this.index++;
            node.push(tree_string[this.index]);
            this.index++;
            return node;
        }
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push left child
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push right child
        return node;
    }

    encode(data) {
        this.heap = new MinHeap();

        // create a map to store the frequency of each character
        var map = new Map();
        for (let i = 0; i < data.length; i++) {
            if (map.has(data[i])) {
                let count = map.get(data[i]);
                map.set(data[i], count + 1);  
            }
            else {
                map.set(data[i], 1);
            }
        }

        if (map.size === 0) {
            let final_string = "zer#";

            let output_message = "Compression complete and file sent for dowloand. " + '\n' + "Compression Ratio: " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
        }

        if (map.size === 1) {
            let key, value;
            for (let [k, v] of map) {
                key = k;
                value = v;
            }
            let final_string = "one" + '#' + key + '#' + value.toString();
            let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio: " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
        }

        // Push the characters (key) and their frequencies (value) into the heap
        for (let [key, value] of map) {
            this.heap.enqueue([value, key]);
        }

        while (this.heap.size() >= 2) {
            let min_node1 = this.heap.top();
            this.heap.dequeue();
            let min_node2 = this.heap.top();
            this.heap.dequeue();
            this.heap.enqueue([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
        }

        var huffman_tree = this.heap.top();
        this.heap.dequeue();
        this.codes = {};
        this.getCodes(huffman_tree, "");
        
        // convert data into coded data
        let binary_string = "";
        for (let i = 0; i < data.length; i++) {
            binary_string += this.codes[data[i]];
        }
        let padding_length = (8 - (binary_string.length % 8)) % 8;
        for (let i = 0; i < padding_length; i++) {
            binary_string += '0'
        }   
        let encoded_data = "";
        for (let i = 0; i < binary_string.length;) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - 0;
            }
            encoded_data += String.fromCharCode(curr_num);
        }
        
        let tree_string = this.make_string(huffman_tree);
        let ts_length = tree_string.length;
        let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;

        let output_message = "Compresison complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
        console.log(final_string);
        return [final_string, output_message];
        
    }

    decode(data) {
        // get the length of the tree string
        let k = 0;
        let temp = "";
        while (k < data.length && data[k] != "#") {
            temp += data[k];
            k++;
        }

        if (k === data.length) {
            alert("Invalid File!\nPlease submit a valid compressed .txt file to decompress and try again!");
            location.reload();
            return;
        }
        if (temp === 'zer') {
            let decoded_data = "";
            let output_message = "Decompression complete and file sent for download.";
            return [decoded_data, output_message];
        }
        if (temp === 'one') {
            // get the character 
            data = data.slice(k + 1);
            k = 0;
            temp = "";
            while (data[k] != '#') {
                temp += data[k];
                k++;
            }
            let one_char = temp;
            // get the frequency of the character
            data = data.slice(k + 1);
            let str_len = parseInt(data);

            // decode the data
            let decoded_data = "";
            for (let i = 0; i < str_len; i++) {
                decoded_data += one_char;
            }
            let output_message = "Decompression complete and file sent for download.";
            return [decoded_data, output_message];
        }

        let ts_length = parseInt(temp);
        // get the padding length
        data = data.slice(k + 1);
        k = 0;
        temp = ""; 
        while (data[k] != '#') {
            temp += data[k];
            k++;
        } 
        let padding_length = parseInt(temp);
        
        // get the tree string
        data = data.slice(k + 1);
        temp = "";
        for (k = 0; k < ts_length; k++) {
            temp += data[k];
        }
        data = data.slice(k);
        let tree_string = temp;

        // get the encoded data
        temp = "";
        for (k = 0; k < data.length; k++) {
            temp += data[k];
        }
        let encoded_data = temp;
        this.index = 0;
        var huffman_tree = this.make_tree(tree_string);

        let binary_string = "";
        // retrieve binary string from encoded data
        for (let i = 0; i < encoded_data.length; i++) {
            let curr_num = encoded_data.charCodeAt(i);
            let curr_binary = "";
            for (let j = 0; j < 8; j++) {
                curr_binary = (curr_num % 2) + curr_binary;
                curr_num = Math.floor(curr_num / 2);
            }
            binary_string += curr_binary;
        }
        // remove padding   
        binary_string = binary_string.slice(0, -padding_length);

        // decode the data using binary string and huffman tree
        let decoded_data = "";
        let node = huffman_tree;
        for (let i = 0; i < binary_string.length; i++) {
            if (binary_string[i] === '1') {
                node = node[1];
            }
            else {
                node = node[0];
            }

            if (typeof (node[0]) === "string") {
                decoded_data += node[0];
                node = huffman_tree;
            }

        }
        let output_message = "Decompression complete and file sent for download.";
        return [decoded_data, output_message];
    }
}

// module.exports = Codec;
export default Codec;

