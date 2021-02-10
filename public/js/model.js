
function normalise(i, min, max){
    return((i - min) / (max - min))
}


const config = { // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
    // hiddenLayers: [9,9,9],
    // outputSize: 3,
    // inputSize: 9,
    // learningRate: 0.1
  };

var net = null;


fetch("http://127.0.0.1:5000/getnet")
  .then(response => response.json())
  .then( data => {
      loadnet(data)
  });


// fetch("http://127.0.0.1:5000/getdata")
//   .then(response => response.json())
//   .then(data => {
//     trainmodel(data)
//   });

// async function train (data) {
//     if(net == null){
//         newnet()
//     }

//     console.log(data);
//     files = Object.keys(data)

//     trainingData = []
//     files.forEach(fileName => {
//         console.log(fileName)
//         data[fileName].forEach(row => {
//             var inputlist = []
//             var outputlist = []
//             var rowlen = row.length

//             for(var i = 0; i < rowlen - 4; i++){
//                 inputlist.push(norm(Number(row[i]), 0, c.width))
//             }
//             inputlist.push(norm(Number(row[rowlen - 4]), 0,360))
//             for(var i = rowlen - 3; i < rowlen; i++){
//                 outputlist.push(Number(row[i]))
//             }
//             trainingData.push({ input: inputlist, output: outputlist})
//         });
//     });

//     net.train(trainingData);
    
//     saveNet()
// }
async function trainmodel (states) {
    if(net == null){
        newnet()
    }

    // console.log(states);

    trainingData = []
    states.forEach(row => {
        var inputlist = []
        var outputlist = []
        var rowlen = row.length

        for(var i = 0; i < rowlen - 4; i++){
            inputlist.push(norm(row[i], 0, c.width))
        }
        inputlist.push(norm(row[rowlen - 4], 0,360))
        for(var i = rowlen - 3; i < rowlen; i++){
            outputlist.push(row[i])
        }
        trainingData.push({ input: inputlist, output: outputlist})
    });


    net.train(trainingData);
    
    saveNet()
}

async function saveNet() {
    var netmodel = net.toJSON();
    // console.log(netmodel)

    
    //create xhr object
    let xhr = new XMLHttpRequest(); 
    //open conneciton
    xhr.open("POST", "http://127.0.0.1:5000/postnet", true); 
    //set request header
    xhr.setRequestHeader("Content-Type", "application/json"); 
    // Create a state change callback 
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 

            // Print received data from server 
            result.innerHTML = this.responseText; 

        } 
    };
    // Converting JSON data to string 
    var data = JSON.stringify(netmodel); 

    // Sending data with the request 
    xhr.send(data); 
    
}

function loadnet(data) {
    net = new brain.NeuralNetwork();
    net.fromJSON(data);
}

function newnet(){
    net = new brain.NeuralNetwork(config);
}

  
function playnet(input) {
    inputlist = []
    for(var i = 0; i < input.length - 1; i++){
        inputlist.push(norm(Number(input[i]), 0, c.width))
    }
    inputlist.push(norm(Number(input[ input.length - 1]), 0,360))

    var output = net.run(inputlist);

    if(output[0] >0.4){
        dogList[0].turnLeft()
    }
    if(output[1] > 0.4){
        dogList[0].turnRight()
    }
    if(output[2] > 0.4){
        dogList[0].goForwards()
    }

    // console.log(output);
}
// var output = net.run([1, 0]);
  
//   console.log(output);