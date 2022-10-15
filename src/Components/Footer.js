import React from "react";

const Footer = () => {
	return (
		<div className='footer'>
			Using React to display current and new giphs on the Solana blockchain
			through a Rust contract.
			<div className="footer_links">
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
			</div>
		</div>
	);
};

export default Footer;
