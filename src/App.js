import './app.css'
import React, { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import kp from "./keypair.json";
import Footer from './Components/Footer'

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey("3qbP7m8xbYkYzm6avvS2RMo3DiLz2rvvZ1HjxunPS3XJ");

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
	preflightCommitment: "processed",
};

const getProvider = () => {
	const connection = new Connection(network, opts.preflightCommitment);
	const provider = new AnchorProvider(
		connection,
		window.solana,
		opts.preflightCommitment
	);
	return provider;
};

console.log(window.innerWidth);

const App = () => {
	const [walletAddress, setWalletAddress] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [gifList, setGifList] = useState([]);

	// is phantom wallet connected?
	const checkIfWalletIsConnected = async () => {
		// Using optional chaining (question mark) to check if the object is null
		if (window?.solana?.isPhantom) {
			console.log("Phantom wallet found!");
			/* Connect directly with the user's wallet */
			const response = await window.solana.connect({ onlyIfTrusted: true });
			console.log("Connected with Public Key:", response.publicKey.toString());
			setWalletAddress(response.publicKey.toString());
		} else {
			alert("Solana object not found! Get a Phantom Wallet 👻");
		}
	};

	const connectWallet = async () => {
		const { solana } = window;

		if (solana) {
			const response = await solana.connect();
			console.log("Connected with Public Key:", response.publicKey.toString());
			setWalletAddress(response.publicKey.toString());
		}
	};

	const createGifAccount = async () => {
		console.log("click");
		try {
			const provider = getProvider();
			const program = await getProgram();

			console.log("ping");
			await program.rpc.startStuffOff({
				accounts: {
					baseAccount: baseAccount.publicKey,
					user: provider.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				},
				signers: [baseAccount],
			});
			console.log(
				"Created a new BaseAccount w/ address:",
				baseAccount.publicKey.toString()
			);
			await getGifList();
		} catch (error) {
			console.log("Error creating BaseAccount account:", error);
		}
	};

	const sendGif = async () => {
		if (inputValue.length === 0) {
			console.log("No gif link given!");
			return;
		}
		setInputValue("");
		console.log("Gif link:", inputValue);
		try {
			const provider = getProvider();
			const program = await getProgram();

			await program.rpc.addGif(inputValue, {
				accounts: {
					baseAccount: baseAccount.publicKey,
					user: provider.wallet.publicKey,
				},
			});
			console.log("GIF successfully sent to program", inputValue);

			await getGifList();
		} catch (error) {
			console.log("Error sending GIF:", error);
		}
	};

	const onInputChange = (event) => {
		const { value } = event.target;
		setInputValue(value);
	};

	const renderNotConnectedContainer = () => (
		<button
			className='cta-button connect-wallet-button'
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);

	const renderConnectedContainer = () => {
		// If we hit this, it means the program account hasn't been initialized.
		if (gifList === null) {
			return (
				<div className='connected-container'>
					<button
						className='cta-button submit-gif-button'
						onClick={createGifAccount}
					>
						Do One-Time Initialization For GIF Program Account
					</button>
				</div>
			);
		}
		// Otherwise, we're good! Account exists. User can submit GIFs.
		else {
			return (
				<div className='connected-container'>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							sendGif();
						}}
					>
						<input
							type='text'
							placeholder='Enter your dance gif here!'
							value={inputValue}
							onChange={onInputChange}
						/>
						<button type='submit' className='cta-button submit-gif-button'>
							Submit
						</button>
					</form>
					<div className='giphy_link'>
						{" "}
						<a
							href='https://giphy.com/search/dance-party'
							rel='noreferrer'
							target='_blank'
						>
							Go to giphy.com
						</a>
					</div>
					<div className='gif-grid'>
						{/* We use index as the key instead, also, the src is now item.gifLink */}
						{gifList.map((item, index) => (
							<div className='gif-item' key={index}>
								<img src={item.gifLink} alt='gif' />
							</div>
						))}
					</div>
					<Footer />
				</div>
			);
		}
	};

	const getProgram = async () => {
		// Get metadata about your solana program
		const idl = await Program.fetchIdl(programID, getProvider());
		// Create a program that you can call
		return new Program(idl, programID, getProvider());
	};

	const getGifList = async () => {
		try {
			const program = await getProgram();
			const account = await program.account.baseAccount.fetch(
				baseAccount.publicKey
			);

			console.log("Got the account", account);
			setGifList(account.gifList);
		} catch (error) {
			console.log("Error in getGifList: ", error);
			setGifList(null);
		}
	};

	useEffect(() => {
		if (walletAddress) {
			console.log("Fetching GIF list...");
			getGifList();
		}
	}, [walletAddress]); /* eslint-disable-line */

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};

		window.addEventListener("load", onLoad);
		return () => window.removeEventListener("load", onLoad);
	}, []);

	return (
		<div className='App'>
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? "authed-container" : "container"}>
				<div className='header-container'>
					<p className='header'> Solana Blockchain Dance Party </p>
					<p className='sub-text'>You're invited!</p>
					{/* Add the condition to show this only if we don't have a wallet address */}
					{!walletAddress && renderNotConnectedContainer()}
					{walletAddress && renderConnectedContainer()}
				</div>
				
			</div>

		</div>
	);
};

export default App;
