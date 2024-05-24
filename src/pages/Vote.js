import { propTitle, description, startDate, endDate, total } from "./propdata";
import { useEffect, useState } from "react";
import { fetchPoll, fetchVoter, vote } from "./soroban";
import { retrievePublicKey, checkConnection } from "./freighter";


export default function Vote({ publicKey }) {
    const [total, setTotal] = useState(0);
    const [hasVoted, setHasVoted] = useState(null);

    useEffect(() => {
        fetchPoll(publicKey).then((values) => {
            fetchVotes(values);
        });

    }, []);

    const handleCastVote = async () => {
        setHasVoted(false);
    }

    async function getVoter() {
        let voterinfo = await fetchVoter();
        let choicebuttons = document.getElementById("choicebuttons");
        let initButton = document.getElementById("initiate");
        initButton.remove();
        if (voterinfo[0] == "none") {
            for (let i = 0; i < choices.length; i++) {
                let choicedesc = choices[i]
                let _button = document.createElement("button");
                _button.value = choicedesc;
                _button.onclick = () => submitVote(choicedesc)
                _button.innerHTML = choicedesc;
                choicebuttons.appendChild(_button);
                choicebuttons.appendChild(document.createElement("br"));
            }
            return;
        }
        else {
            let title = document.createElement("h5");
            title.textContent = "Vote Already Submitted";
            title.style.color = 'white'
            let choice = document.createElement("h5");
            choice.textContent = "Voted: " + voterinfo[0];
            choice.style.color = 'white'
            choicebuttons.appendChild(title);
            choicebuttons.appendChild(choice);
            return;
        }
    }

    // const loadOptions = async () => {
    //     let choicebutton = document.getElementById("choicebuttons");
    //     let _button = document.createElement("button");
    //     _button.onclick = () => getVoter();
    //     _button.id = "initiate";

    //     choicebutton.appendChild(_button);
    //     choicebutton.appendChild(document.createElement("br"));
    // }


    async function fetchVotes(poll) {
        let value = [poll[2], poll[0]];
        setTotal(poll[1]);
        let container = document.getElementById("choicecontainer");
        for (let i = 0; i < choices.length; i++) {
            let choicecount = value[i];
            let choicedesc = choices[i];
            if (choicecount == 0) {
                let div2 = document.createElement("div");
                let html2 = `
              <h5>${choicedesc}: ${choicecount}</h5>
              <h5>0%</h5>
            `
                div2.innerHTML = html2
                container.appendChild(div2);
                container.appendChild(document.createElement("br"));
            }
            else {
                let choicepercent = ((100 * choicecount) / poll[1]).toFixed(2)
                let div1 = document.createElement("div");
                let div2 = document.createElement("div");
                div2.className = "progress-bar my-0"
                div2.role = "progressbar"
                div2.style.textAlign = 'right';
                div2.style.width = (choicepercent / 4) + 'rem';
                let html1 = `
            <h5>${choicedesc}: ${choicecount}</h5>
            `
                let html2 = `
            <h5>${choicepercent}%</h5>
            `
                div1.innerHTML = html1
                div2.innerHTML = html2
                container.appendChild(div1);
                container.appendChild(div2);
                container.appendChild(document.createElement("br"));
            }
        }
        loadOptions();

        return;
    }



    async function submitVote(value) {
        await vote(value);
        location.reload()
    }


    return (
        <div className="vote-container">
            <p className="welcome-message">Welcome {publicKey}</p>
            <section className="proposal-section">
                <h1 className="proposal-title">Decentralized Voting system</h1>
                <article className="proposal-description">
                    <h5>A new community of blockchain enthusiasts.</h5>
                    <p>{description}</p>
                </article>
            </section>
            <div className="voting-section">
                <section className="voting-stats">
                    <h5>Voting</h5>
                    <ul className="stats-list">
                        <li>
                            <h6>Start Date</h6>
                            <span>{startDate}</span>
                        </li>
                        <li>
                            <h6>End Date</h6>
                            <span>{endDate}</span>
                        </li>
                        <li>
                            <h6>Total Votes</h6>
                            <h3>
                                <span>{total}</span>
                            </h3>
                        </li>
                    </ul>
                </section>
                <section className="vote-section">
                    <h4>Vote</h4>
                    <button onClick={handleCastVote}>Cast Vote</button>

                </section>
            </div>



        </div>
    );
}
