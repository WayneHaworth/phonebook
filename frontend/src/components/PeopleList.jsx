const PeopleList = ({ personsToShow, deletePerson }) => {
    return (<>
        <h2>Numbers</h2>
        {personsToShow.map((person) => (
            <li key={person.id}>
                {person.name} - {person.number}
                - <button onClick={() => deletePerson(person)}>delete</button>
            </li>)
        )}
    </>)
}

export default PeopleList