#![no_std] // Disables the standard library, required for no_std environments like embedded systems or blockchain contracts.

use soroban_sdk::{contract, contracttype, contractimpl, Env, Symbol, symbol_short, Address}; // Imports necessary components from the Soroban SDK.

// Defines a contract type for a voting poll.
#[contracttype]
#[derive(Clone)] // Allows cloning of the Poll struct, useful for copying.
pub struct Poll {
    pub yes: u64, // Number of votes for 'yes'.
    pub no: u64, // Number of votes for 'no'.
    pub total: u64, // Total number of votes cast.
    pub is_frozen: bool, // Indicates if the poll is frozen and cannot accept new votes.
    pub owner: Address, // The address of the poll's owner.
}

const POLL: Symbol = symbol_short!("POLL"); // A constant representing the symbol for the poll.

// Defines a contract type for a registry of voters' records.
#[contracttype]
pub enum Registry {
    Record(Address), // Each variant holds an Address representing a voter's record.
}

// Defines a contract type for individual voter records.
#[contracttype]
#[derive(Clone)] // Allows cloning of the Record struct, useful for copying.
pub struct Record {
    pub selected: Symbol, // The symbol representing the voter's choice ('YES' or otherwise).
    pub votes: u64, // Number of votes cast by the voter.
    pub time: u64, // Timestamp of the last vote cast by the voter.
}

const YES: Symbol = symbol_short!("YES"); // A constant representing the symbol for 'YES'.

// Implements the main contract functionality.
#[contract]
pub struct VoteContract;

// Implements the methods for the VoteContract.
#[contractimpl]
impl VoteContract {
    // Initializes a new poll with the given owner.
    pub fn initialize(env: Env, owner: Address) {
        owner.require_auth(); // Ensures the caller is authorized.
        let poll = Poll { // Creates a new Poll instance.
            yes: 0,
            no: 0,
            total: 0,
            is_frozen: false,
            owner: owner.clone(), // Clones the owner's address for the poll.
        };
        env.storage().instance().set(&POLL, &poll); // Stores the poll in storage.
    }

    // Records votes for a given user and selection.
    pub fn record_votes(env: Env, user: Address, selected: Symbol) -> Symbol {
        let mut poll = Self::view_poll(env.clone()); // Retrieves the current poll state.

        if poll.is_frozen {
            panic!("Poll is frozen, cannot vote"); // Panics if the poll is frozen.
        }

        let mut records = Self::view_voter(env.clone(), user.clone()); // Retrieves the voter's record.
        user.require_auth(); // Ensures the caller is authorized.
        let votes: u64 = 1; // Votes cast by the user.
        let time = env.ledger().timestamp(); // Current timestamp.

        if votes == 0 || records.time != 0 || votes > 5 {
            panic!("Cannot Vote"); // Panics under certain conditions.
        } else {
            records.selected = selected; // Updates the voter's selection.
            records.votes = votes; // Updates the voter's vote count.
            records.time = time; // Updates the voter's last vote timestamp.

            if records.selected == YES {
                poll.yes += votes; // Increments the 'yes' count.
            } else {
                poll.no += votes; // Increments the 'no' count.
            }
            poll.total += votes; // Increments the total vote count.

            env.storage().instance().set(&Registry::Record(user), &records); // Stores the updated voter record.
            env.storage().instance().set(&POLL, &poll); // Stores the updated poll.
            env.storage().instance().extend_ttl(100, 100); // Extends the TTL of the stored items.

            symbol_short!("Recorded") // Returns a success message.
        }
    }

    // Freezes the poll, preventing further voting.
    pub fn freeze_poll(env: Env, owner: Address) {
        let mut poll = Self::view_poll(env.clone()); // Retrieves the current poll state.

        // Checks if the caller is the owner of the poll.
        if poll.owner != owner {
            panic!("Only the owner can freeze the poll");
        }

        owner.require_auth(); // Ensures the caller is authorized.

        // Sets the poll to frozen.
        poll.is_frozen = true;
        env.storage().instance().set(&POLL, &poll); // Stores the updated poll.
    }

    // Views the current state of the poll.
    pub fn view_poll(env: Env) -> Poll {
        env.storage().instance().get(&POLL).unwrap_or(Poll { // Retrieves the poll from storage or initializes a new one.
            yes: 0,
            no: 0,
            total: 0,
            is_frozen: false,
            owner: env.current_contract_address(), // Uses the contract's address as the default owner.
        })
    }

    // Views the record of a specific voter.
    pub fn view_voter(env: Env, voter: Address) -> Record {
        let key = Registry::Record(voter.clone()); // Constructs the key for the voter's record.
        env.storage().instance().get(&key).unwrap_or(Record { // Retrieves the voter's record from storage or initializes a new one.
            selected: symbol_short!("none"),
            votes: 0,
            time: 0,
        })
    }
}



