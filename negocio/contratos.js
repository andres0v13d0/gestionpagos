document.addEventListener('DOMContentLoaded', () => {
    const contractForm = document.getElementById('contract-form');
    const contractsTableBody = document.getElementById('contracts-table').querySelector('tbody');
    const upcomingExpirationsTableBody = document.getElementById('upcoming-expirations-table').querySelector('tbody');

    let contracts = [];
    let nextId = 1;
    let isEditing = false;
    let currentEditId = null;

    const isValidCI = (ci) => {
        var isNumeric = true;
        var total = 0, 
            individual;

        for (var position = 0 ; position < 10 ; position++) {
            individual = ci.toString().substring(position, position + 1);

            if(isNaN(individual)) {
                console.log(ci, position,individual, isNaN(individual));
                isNumeric=false;
                break;
            } else {
                if(position < 9) {
                    if(position % 2 == 0) {
                        if(parseInt(individual)*2 > 9) {
                            total += 1 + ((parseInt(individual)*2)%10);
                        } else {
                            total += parseInt(individual)*2;
                        }
                    } else {
                        total += parseInt(individual);
                    }
                }
            }
        }

        if((total % 10) != 0) {
            total =  (total - (total%10) + 10) - total;
        } else {
            total = 0 ;
        }

        if(isNumeric) {
            if(ci.toString().length != 10) {
                alert("La cédula debe ser de 10 dígitos.");
                return false;
            }

            if (parseInt(ci, 10) == 0) {
                alert("La cédula ingresada no puede ser cero.");
                return false;
            }

            if(total != parseInt(individual)) {
                alert("La cédula ingresada no es válida.");
                return false;
            }

            console.log('cédula válida', ci);
            return true;
        }

        alert("El dato solo puede contener números.");
        return false;
    };

    const loadContracts = () => {
        contractsTableBody.innerHTML = '';
        contracts.forEach(contract => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contract.id}</td>
                <td>${contract.resident_name}</td>
                <td>${contract.id_number}</td>
                <td>${contract.property_address}</td>
                <td>${contract.start_date}</td>
                <td>${contract.end_date}</td>
                <td>${contract.rent}</td>
                <td>
                    <button onclick="editContract(${contract.id})">Edit</button>
                    <button onclick="deleteContract(${contract.id})">Delete</button>
                </td>
            `;
            contractsTableBody.appendChild(row);
        });
    };

    const loadUpcomingExpirations = () => {
        const now = new Date();
        upcomingExpirationsTableBody.innerHTML = '';
        contracts.filter(contract => {
            const endDate = new Date(contract.end_date);
            return endDate > now && endDate < new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }).forEach(contract => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contract.id}</td>
                <td>${contract.resident_name}</td>
                <td>${contract.id_number}</td>
                <td>${contract.property_address}</td>
                <td>${contract.start_date}</td>
                <td>${contract.end_date}</td>
                <td>${contract.rent}</td>
            `;
            upcomingExpirationsTableBody.appendChild(row);
        });
    };

    const addContract = (contract) => {
        contracts.push(contract);
        loadContracts();
        loadUpcomingExpirations();
    };

    const updateContract = (updatedContract) => {
        contracts = contracts.map(contract => contract.id === updatedContract.id ? updatedContract : contract);
        loadContracts();
        loadUpcomingExpirations();
    };

    const editContract = (id) => {
        const contract = contracts.find(c => c.id === id);
        if (contract) {
            document.getElementById('resident_name').value = contract.resident_name;
            document.getElementById('id_number').value = contract.id_number;
            document.getElementById('property_address').value = contract.property_address;
            document.getElementById('start_date').value = contract.start_date;
            document.getElementById('end_date').value = contract.end_date;
            document.getElementById('rent').value = contract.rent;

            isEditing = true;
            currentEditId = id;

            contractForm.onsubmit = handleFormSubmit;
        }
    };

    const deleteContract = (id) => {
        contracts = contracts.filter(contract => contract.id !== id);
        loadContracts();
        loadUpcomingExpirations();
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const resident_name = document.getElementById('resident_name').value;
        const id_number = document.getElementById('id_number').value;
        const property_address = document.getElementById('property_address').value;
        const start_date = document.getElementById('start_date').value;
        const end_date = document.getElementById('end_date').value;
        const rent = document.getElementById('rent').value;

        if (!isValidCI(id_number)) {
            return;
        }

        if (new Date(start_date) >= new Date(end_date)) {
            alert('La fecha de vencimiento no puede ser anterior a la fecha de inicio');
            return;
        }

        if (rent <= 0) {
            alert('La renta debe ser mayor a 0');
            return;
        }

        if (isEditing) {
            const updatedContract = {
                id: currentEditId,
                resident_name,
                id_number,
                property_address,
                start_date,
                end_date,
                rent
            };
            updateContract(updatedContract);
            isEditing = false;
            currentEditId = null;
        } else {
            const newContract = {
                id: nextId++,
                resident_name,
                id_number,
                property_address,
                start_date,
                end_date,
                rent
            };
            addContract(newContract);
        }

        contractForm.reset();
        contractForm.onsubmit = handleFormSubmit;
    };

    contractForm.onsubmit = handleFormSubmit;
    loadContracts();
    loadUpcomingExpirations();

    window.editContract = editContract;
    window.deleteContract = deleteContract;
});