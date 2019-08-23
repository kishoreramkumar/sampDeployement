import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';

const themes = {
	black: {
		textColor: '#fff',
		backgroundColor: 'rgba(0,0,0,.85)'
	}
};

//  TooltipPosition can be : 'top' | 'bottom' | 'left' | 'right'

const Element = styled.div`
	background: ${props => themes[props.theme].backgroundColor};
	color: ${props => themes[props.theme].textColor};
	border-radius: ${props => props.borderRadius + 'px'};
	width: max-content;
	text-align: center;
	padding: ${props => props.padding + 'px'};
	line-height: ${props => props.lineHeight};
	font-size: 13px;
	pointer-events: none;
	max-width: 260px;
`;

// the main element component
const Trigger = styled.div`
	display: inline-block;
	position: relative;
`;

// styled tooltip arrow component
const Arrow = styled.div`
	position: absolute;
	width: 0;
	height: 0;
	&::before {
		content: '';
		margin: auto;
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: ${props => props.arrowWidth + 'px'};
		border-color: transparent;
	}
	&[data-placement*='top'] {
		bottom: 0;
		margin-left: ${props => props.arrowWidth * -2 + 'px'};
		&::before {
			border-bottom-width: 0;
			border-top-color: ${props => themes[props.theme].backgroundColor};
		}
	}
	&[data-placement*='right'] {
		left: 0;
		margin-top: ${props => props.arrowWidth * -2 + 'px'};
		margin-left: -${props => props.arrowWidth + 'px'};
		&::before {
			border-left-width: 0;
			border-right-color: ${props => themes[props.theme].backgroundColor};
		}
	}
	&[data-placement*='bottom'] {
		top: 0;
		left: 0;
		margin-left: ${props => props.arrowWidth * -2 + 'px'};
		margin-top: -${props => props.arrowWidth + 'px'};
		&::before {
			border-top-width: 0;
			border-bottom-color: ${props => themes[props.theme].backgroundColor};
		}
	}
	&[data-placement*='left'] {
		right: 0;
		margin-top: ${props => props.arrowWidth * -2 + 'px'};
		&::before {
			border-right-width: 0;
			border-left-color: ${props => themes[props.theme].backgroundColor};
		}
	}
`;

class ObservedElement extends React.Component {
	componentDidUpdate() {
		this.props.scheduleUpdate();
	}
	render() {
		return <Element ref={this.props.innerRef} {...this.props} />;
	}
}

/*****
    * Main Tooltip component with wraps the element and the tooltip
    * React popper is used to get the position of the tooltip and arrow 
        - elements wrapped under Reference is element
        - elements wrapped under popper is tooltip 
        - Popper will return ref, style and position through render props
 *****/

class Tooltip extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
			// generating id in constructor to keep it consistent across renders
		};
	}

	showTooltip = () => {
		this.setState({ visible: true });
	};

	hideTooltip = () => {
		this.setState({ visible: false });
	};

	render() {
		const { content, showArrow, ...props } = this.props;

		return (
			<Manager>
				<Reference>
					{sampprops => {
						return (
							<Trigger
								onMouseEnter={this.showTooltip}
								onFocus={this.showTooltip}
								onMouseLeave={this.hideTooltip}
								onBlur={this.hideTooltip}
								ref={sampprops.ref}
							>
								{props.children}
							</Trigger>
						);
					}}
				</Reference>
				<Popper
					placement={props.position}
					positionFixed={true}
					modifiers={{
						preventOverflow: { enabled: true },
						hide: { enabled: true },
						offset: { offset: '0, 10' }
					}}
				>
					{({ ref, style, placement, arrowProps, scheduleUpdate, ...rest }) => {
						return (
							<>
								{this.state.visible ? (
									<ObservedElement
										scheduleUpdate={scheduleUpdate}
										innerRef={ref}
										style={{ zIndex: 20, ...style }}
										data-placement={placement}
										id={props.id}
										{...props}
									>
										{content}
										{showArrow && (
											<Arrow
												data-placement={placement}
												ref={arrowProps.ref}
												style={arrowProps.style}
												theme={props.theme}
												arrowWidth={props.arrowWidth}
											/>
										)}
									</ObservedElement>
								) : null}
							</>
						);
					}}
				</Popper>
			</Manager>
		);
	}
}

Tooltip.defaultProps = {
	id: 'tooltip-id',
	theme: 'black',
	arrowWidth: 6,
	padding: 6,
	borderRadius: 3,
	lineHeight: 1.4,
	content: null,
	position: 'bottom', //  ['top', 'bottom', 'left', 'right']
	showArrow: false
};
export default Tooltip;
