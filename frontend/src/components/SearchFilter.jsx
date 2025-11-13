const SearchFilter = ({ searchText, handleSearchText }) => {
    return (
        <div>
            filter shown with
            <input
                value={searchText}
                onChange={handleSearchText}
            />
        </div>
    )
}

export default SearchFilter