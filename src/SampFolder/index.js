import React from 'react';
import './index.css';
import Tooltip from '../Tooltip';
import { logo } from '../logo.svg';

function SampFolder() {
	return (
		<div className='samp-text'>
			<Tooltip
				position='bottom'
				content={
					<span>
						This is a very long text. Please try to keep it no longer than 4 lines. The tooltip should be a
						short and helpful text.
					</span>
				}
				showArrow
			>
				Hover here
			</Tooltip>
		</div>
	);
}

export default SampFolder;
