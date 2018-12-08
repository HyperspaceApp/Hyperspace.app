import React from 'react'

const SearchButton = ({path, actions}) => {
	const handleClick = () => {
		actions.toggleSearchField()
		actions.setSearchText('', path)
	}
	return (
		<div onClick={handleClick} className="search-button">
			<button> Search Files </button>
		</div>
	)
}

export default SearchButton
