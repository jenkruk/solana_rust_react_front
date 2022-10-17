import React from "react";

const Footer = () => {
	return (
		<div className='footer'>
			Using React to display current and new giphs on the Solana blockchain
			through a Rust contract.
			<div className='footer_links'>
				<a
					href='https://github.com/jenkruk/solana_rust_react_front'
					target='_blank'
					rel='noreferrer'
				>
					Github Repo for frontend
				</a>
				<a
					href='https://github.com/jenkruk/solana_rust_backend'
					target='_blank'
					rel='noreferrer'
				>
					Github Repo for contract
				</a>
				<a
					href='https://explorer.solana.com/address/3qbP7m8xbYkYzm6avvS2RMo3DiLz2rvvZ1HjxunPS3XJ?cluster=devnet&utm_source=buildspace.so&utm_medium=buildspace_project'
					target='_blank'
					rel='noreferrer'
				>
					Contract on Solana
				</a>
			</div>
		</div>
	);
};

export default Footer;
