Parse.initialize("2HuhENDQHYRWjTYs7DgKYo0axzpXhqKkJcR5HdwX", "wFIMZFocBXXnKnjRFud6H0WTvGeZoigMLh3345gz");
Parse.serverURL = 'https://parseapi.back4app.com';

const expenseForm = document.getElementById('expenseForm');
const expensesTableBody = document.querySelector('#expensesTable tbody');
const totalValueSpan = document.getElementById('totalValue');


expenseForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const value = parseFloat(document.getElementById('value').value);

    const Expense = Parse.Object.extend("Expense");
    const expense = new Expense();

    expense.set('description', description);
    expense.set('value', value);

    try {
        await expense.save();
        loadExpenses();
        expenseForm.reset();
    } catch (error) {
        console.error('Erro ao salvar a despesa: ', error);
    }
});

async function loadExpenses() {
    const Expense = Parse.Object.extend("Expense");
    const query = new Parse.Query(Expense);
    try {
        const results = await query.find();
        expensesTableBody.innerHTML = '';
        let total = 0;

        results.forEach(expense => { 
            const id = expense.id;
            const description = expense.get('description');
            const value = expense.get('value');

            total += value;

            const row = `
                <tr>
                    <td>${description}</td>
                    <td><input type="number" value="${value}" data-id="${id}" class="updateValue" /></td>
                    <td class="actions">
                        <button onclick="updateExpense('${id}')">Atualizar</button>
                        <button onclick="deleteExpense('${id}')">Deletar</button>
                    </td>
                </tr>
            `;
            console.log(row);
            expensesTableBody.insertAdjacentHTML('beforeend', row);
        });

        totalValueSpan.textContent = total.toFixed(2);
    } catch (error) {
        console.error('Erro ao carregar despesas: ', error);
    }
}

async function updateExpense(id) {
    const valueInput = document.querySelector(`input[data-id='${id}']`);
    const newValue = parseFloat(valueInput.value);
    const Expense = Parse.Object.extend("Expense");
    const query = new Parse.Query(Expense);

    try {
        const expense = await query.get(id);
        expense.set('value', newValue);
        await expense.save();
        loadExpenses();
    } catch (error) {
        console.error('Erro ao atualizar despesa: ', error);
    }
}

async function deleteExpense(id) {
    const Expense = Parse.Object.extend("Expense");
    const query = new Parse.Query(Expense);

    try {
        const expense = await query.get(id);
        await expense.destroy();
        loadExpenses();
    } catch (error) {
        console.error('Erro ao deletar despesa: ', error);
    }
}

loadExpenses();
