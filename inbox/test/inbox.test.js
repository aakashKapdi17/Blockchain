const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());
const {interface,bytecode}=require('../compile')

// class Car{
//     park(){
//         return 'stopped';
//     }

//     drive(){
//         return 'vroom';
//     }
// }

// let car;
// beforeEach(()=>{
//     car=new Car();
// })
// describe('Car',()=>{
//     it('can park',()=>{
//         assert.equal(car.park(),'stopped');
//     });

//     it('can drive',()=>{
//         assert.equal(car.drive(),'vroom');
//     });
// });




// beforeEach(()=>{
//     //get a list of all accounts
//     web3.eth.getAccounts().then(
//         fetchedAccounts=>{
//             console.log(fetchedAccounts);
//         }
//     );


//     // use one of those accounts to deploy 
//     // the contract
// });


let accounts;
let inbox;
const INITIAL_MESSAGE="Hi There";

beforeEach(async()=>{
    //get a list of all accounts
    accounts=await web3.eth.getAccounts();


    // use one of those accounts to deploy 
    // the contract
    inbox=await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode,arguments:[INITIAL_MESSAGE]})
        .send({from:accounts[0],gas:'1000000'});
});



describe('Inbox',()=>{

    it('Deploys a contract',()=>{
       assert.ok(inbox.options.address);
    });


    it('Has a default Message',async()=>{
        const message=await inbox.methods.message().call();
        assert.equal(message,INITIAL_MESSAGE);
    });

    it('Can change the Message',async()=>{
        const changedMessage="Bye";
        await inbox.methods.setMessage(changedMessage)
                            .send({
                                from:accounts[0]
                            });
        const message=await inbox.methods.message().call();
        assert.equal(message,changedMessage);
    });

});



