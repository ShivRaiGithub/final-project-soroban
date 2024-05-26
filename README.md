## Project Name
VoteContract ( Decentralized Voting System)

## Developer
Shiv Rai

## Comprehensive Description Of Your Project
This decentralized voting system is implemented as a smart contract using the Soroban SDK. The contract enables participants to vote either "YES" or "NO" on a poll, ensuring each participant can vote only once.

### Key Components
1) Poll Struct: Tracks the number of "YES", "NO", and total votes.   
2) Record Struct: Stores a voter's choice, number of votes, and the timestamp of the vote.   
3) Registry Enum: Manages storage keys for voter records.   
4) VoteContract: Main contract implementing the voting logic. 

### Constants
1) POLL: Symbol representing the poll.   
2) YES: Symbol for a "YES" vote.   

### Methods
1) record_votes(env: Env, user: Address, selected: Symbol) -> Symbol: Records a vote for the user, ensuring they vote only once. Updates the poll results and stores the voterrecord.   
2) view_poll(env: Env) -> Poll: Returns the current poll state. Initializes with zero values if the poll doesn't exist.   
3) view_voter(env: Env, voter: Address) -> Record: Returns the voting record for a voter. Initializes a default record if the voter hasn't voted.   

### Usage
1) record_votes: Cast a vote by invoking this method. Ensures single vote per user.   
2) view_poll: Fetch current poll results.   
3) view_voter: Check a user's voting record.      

This contract ensures a transparent and tamper-proof voting process using blockchain technology.   

## Vision
VoteContract aims to revolutionize voting by leveraging blockchain technology to create a transparent, secure, and tamper-proof system. Our goals are to ensure fair and verifiable elections, protect voter data, and eliminate centralized control points. We aspire for global adoption across various sectors, integrating decentralized identity solutions and providing real-time analytics. Committed to continuous innovation, we aim to empower communities, organizations, and governments to make decisions with confidence and integrity.



## Deployment Details 
### Contract
Address of smart contract is : CDLLGJEFRBEEDSCSCDASDC3NUXSQIENASKQVM3XVEMDUO4XOB43LDPZD   
You can copy the code in 'lib.rs' file located in 'soroban-voting-system/contracts/voting-system/src' and paste on ```https://okashi.dev/playground/```, compile code and test out the functions.   
   
You can also compile and deploy on testnet using local system. Use ```https://soroban.stellar.org/docs``` for help.    
Open the `soroban-voting-system` folder and execute the following commands ( assuming you have done the setup from the docs, commands are also available in docs) :   
To Build Contract : ```soroban contract build```   
To Deploy Build Contract to Testnet : ```soroban contract deploy --wasm target/wasm32-unknown-unknown/release/voting_system.wasm --source alice --network testnet```   
If it is successful, you will get a result such as : CDLLGJEFRBEEDSCSCDASDC3NUXSQIENASKQVM3XVEMDUO4XOB43LDPZD   
You can interact with it using the following functions :

#### Functions 
1) initialize : Initializes the voting
2) record_votes : Records the vote for the user (YES/NO)
3) freeze_poll : Owner can freeze the voting. If the voting is frozen then it cannot be voted on.
4) view_poll : View details of the current poll
5)  view_voter : View voting details of an address
    
    Paste the address you got if you deployed your own contract as the contractAddress in soroban.js file located in src folder.   

### Front-End (Nextjs)
#### Running the front end
Clone the repository using ```git clone https://github.com/ShivRaiGithub/final-project-soroban.git```.
Use ```npm install``` to install the dependencies. Use ```npm run devexp``` in order to generate an experimental https ( a dependency requires it) and run the program. If the certificate is generated but the data isn't available on localhost, stop the execution and use ```npm run dev``` to run it again ( use "dev" instead of "devexp" only if a certificate is generated). If all is successful then the page should look like "HomePageExample.png" image located in public folder.

#### Executing commands
Click on Connect button to Connect to freighter wallet. If successful you will see a page like "VotePageExample.png" image located in public folder. Click on 'Fetch Voting Stats' and sign the transaction on freighter wallet to get the status of Votes. Wait for a while until the transaction is mined and data is visible. Click on 'Cast Vote' to get Voting stats. If voted it will show the choice which you voted. else 2 buttons 'Yes' and 'No', clicking on which will ask you to sign transaction.  Page should look like "VotePageView.png" in public folder. Wait a while until transaction mines and data is updated. Reload page and login again to see updated voting stats. Page will look like "VotePageViewAndVoted.png" located in public folder if voting stats are fetched and vote is casted.   
## If you encounter any issue, try reloading the page.