import { propTitle, description, startDate, endDate, choices } from "./propdata"; // Importing proposal data
import { useEffect, useState } from "react"; // Importing hooks from React
import { fetchPoll, fetchVoter, vote } from "./soroban"; // Importing functions to interact with the Soroban contract

export default function Vote({ publicKey }) {
    // State variables to manage component state
    const [total, setTotal] = useState(0); // Total votes
    const [hasVoted, setHasVoted] = useState(null); // User voting status
    const [values, setValues] = useState([]); // Values of votes for choices
    const [pollData, setPollData] = useState([]); // Poll data
    const [userVote, setUserVote] = useState([]); // User's vote information
    const [cast, setCast] = useState(false); // Whether the user has cast a vote
    const [pollFetched, setPollFetched] = useState(false); // Whether the poll data has been fetched

    // Function to fetch poll data from the contract
    async function handleVotingFetch() {
        try {
            if (!pollFetched) { // Fetch only if not already fetched
                const poll = await fetchPoll(publicKey); // Fetch poll data
                fetchVotes(poll); // Process and set poll data
                setPollFetched(true); // Set poll fetched status to true
            }
        } catch (error) {
            console.error("Error fetching poll data:", error);
        }
    }

    // Function to handle casting a vote
    async function handleCasting() {
        await getVoter(); // Fetch voter info
        setCast(true); // Set cast status to true
    }

    // Function to fetch voter info from the contract
    async function getVoter() {
        try {
            let voterinfo = await fetchVoter(); // Fetch voter info
            if (voterinfo[0] === "none") { // If the user has not voted
                setHasVoted(false);
            } else { // If the user has voted
                setHasVoted(true);
                setUserVote(voterinfo);
            }
        } catch (error) {
            console.error("Error fetching voter info:", error);
        }
    }

    // Function to process and set poll data
    async function fetchVotes(poll) {
        setPollData(poll);
        let value = [poll[2], poll[0]]; // Set values from poll data
        setValues(value);
        setTotal(poll[1]); // Set total votes
    }

    // Function to submit a vote to the contract
    async function submitVote(value) {
        try {
            await vote(value); // Submit the vote
            setHasVoted(true); // Set voting status to true
        } catch (error) {
            console.error("Error submitting vote:", error);
        }
    }

    return (
        <div className="vote-container">
            <h1 className="welcome-message">Welcome {publicKey}</h1>
            <section className="proposal-section">
                <h1 className="proposal-title">Decentralized Voting System</h1>
                <article className="proposal-description">
                    <h5>{propTitle}</h5>
                    <p>{description}</p>
                </article>
            </section>
            <div className="voting-section">
                <section className="voting-stats">
                    <h1>Voting</h1>
                    <ul className="stats-list">
                        <li>
                            <h6>Start Date</h6>
                            <span>{startDate}</span>
                        </li>
                        <li>
                            <h6>End Date</h6>
                            <span>{endDate}</span>
                        </li>
                    </ul>
                    <div className="choicecontainer">
                        <br />
                        {pollFetched ? ( // If poll data has been fetched
                            <div>
                                <h5>Total Votes: {total}</h5>
                                {choices.map((choicedesc, index) => {
                                    let choicecount = values[index]; // Get vote count for each choice

                                    if (choicecount == 0) { // If no votes for the choice
                                        return (
                                            <div key={index}>
                                                <h5>{choicedesc}: 0</h5>
                                                <h5>0%</h5>
                                            </div>
                                        );
                                    } else { // If there are votes for the choice
                                        let choicepercent = ((100 * choicecount) / pollData[1]).toFixed(2); // Calculate percentage
                                        return (
                                            <div key={index}>
                                                <h5>{choicedesc}: {choicecount}</h5>
                                                <h5>Percentage: {choicepercent}%</h5>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ) : ( // If poll data has not been fetched
                            <button onClick={handleVotingFetch} className="choiceButton">Fetch Voting Stats</button>
                        )}
                    </div>
                </section>
                <section className="vote-section">
                    {cast ? ( // If user has cast a vote
                        <>
                            <h1>Vote</h1>
                            {hasVoted ? ( // If user has voted
                                <>
                                    <h4>Voted: {userVote[0]}</h4>
                                </>
                            ) : ( // If user has not voted
                                choices.map((choicedesc, index) => (
                                    <div key={index}>
                                        <button className="choiceButton" value={choicedesc} onClick={() => submitVote(choicedesc)}>{choicedesc}</button>
                                        <br />
                                    </div>
                                ))
                            )}
                        </>
                    ) : ( // If user has not cast a vote
                        <button onClick={handleCasting} className="choiceButton">Cast Vote</button>
                    )}
                </section>
            </div>
        </div>
    );
}
